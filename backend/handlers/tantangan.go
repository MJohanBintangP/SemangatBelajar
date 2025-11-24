package handlers

import (
	"backend/config"
	"context"
	"encoding/json"
	"math/rand"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"github.com/dgrijalva/jwt-go"
)

type Tantangan struct {
	ID               int    `json:"id"`
	Judul            string `json:"judul"`
	Deskripsi        string `json:"deskripsi"`
	Poin             int    `json:"poin"`
	TingkatKesulitan string `json:"tingkat_kesulitan"`
}

func GetTantanganHarian(w http.ResponseWriter, r *http.Request) {
	enableCORS(w)
	if r.Method == "OPTIONS" {
		return
	}

	now := time.Now().Format("2006-01-02")
	seed := int64(0)
	for _, c := range now {
		seed += int64(c)
	}
	rnd := rand.New(rand.NewSource(seed))

	rows, err := config.DB.Query(context.Background(), "SELECT id FROM tantangan")
	if err != nil {
		writeJSONError(w, http.StatusInternalServerError, "Gagal mengambil tantangan")
		return
	}
	defer rows.Close()

	var ids []int
	for rows.Next() {
		var id int
		rows.Scan(&id)
		ids = append(ids, id)
	}

	rnd.Shuffle(len(ids), func(i, j int) { ids[i], ids[j] = ids[j], ids[i] })
	if len(ids) > 5 {
		ids = ids[:5]
	}

	tantanganList := make([]Tantangan, 0)
	for _, id := range ids {
		var t Tantangan
		err := config.DB.QueryRow(context.Background(),
			"SELECT id, judul, deskripsi, poin, tingkat_kesulitan FROM tantangan WHERE id=$1", id).
			Scan(&t.ID, &t.Judul, &t.Deskripsi, &t.Poin, &t.TingkatKesulitan)
		if err == nil {
			tantanganList = append(tantanganList, t)
		}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(tantanganList)
}

func SelesaikanTantangan(w http.ResponseWriter, r *http.Request) {
	enableCORS(w)
	if r.Method == "OPTIONS" {
		return
	}
	authHeader := r.Header.Get("Authorization")
	if !strings.HasPrefix(authHeader, "Bearer ") {
		writeJSONError(w, http.StatusUnauthorized, "Unauthorized")
		return
	}
	tokenStr := strings.TrimPrefix(authHeader, "Bearer ")
	token, _ := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
		return jwtKey, nil
	})
	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok || !token.Valid {
		writeJSONError(w, http.StatusUnauthorized, "Unauthorized")
		return
	}
	userID := int(claims["user_id"].(float64))

	var req struct {
		TantanganID int `json:"tantangan_id"`
		Poin        int `json:"poin"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeJSONError(w, http.StatusBadRequest, "Request tidak valid")
		return
	}

	var count int
	err := config.DB.QueryRow(context.Background(),
		"SELECT COUNT(*) FROM tantangan_user WHERE user_id=$1 AND tantangan_id=$2", userID, req.TantanganID).Scan(&count)
	if err == nil && count == 0 {
		config.DB.Exec(context.Background(),
			"INSERT INTO tantangan_user (user_id, tantangan_id, status, waktu_selesai) VALUES ($1, $2, 'selesai', NOW())",
			userID, req.TantanganID)
		config.DB.Exec(context.Background(),
			"UPDATE users SET poin = poin + $1 WHERE id = $2", req.Poin, userID)
	}

	json.NewEncoder(w).Encode(map[string]string{"message": "Tantangan selesai, poin bertambah!"})
}

func GetTantanganSelesaiHariIni(w http.ResponseWriter, r *http.Request) {
	enableCORS(w)
	if r.Method == "OPTIONS" {
		return
	}
	authHeader := r.Header.Get("Authorization")
	if !strings.HasPrefix(authHeader, "Bearer ") {
		writeJSONError(w, http.StatusUnauthorized, "Unauthorized")
		return
	}
	tokenStr := strings.TrimPrefix(authHeader, "Bearer ")
	token, _ := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
		return jwtKey, nil
	})
	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok || !token.Valid {
		writeJSONError(w, http.StatusUnauthorized, "Unauthorized")
		return
	}
	userID := int(claims["user_id"].(float64))

	today := time.Now().UTC().Format("2006-01-02")
	rows, err := config.DB.Query(context.Background(),
		`SELECT tantangan_id FROM tantangan_user WHERE user_id=$1 AND status='selesai' AND waktu_selesai >= $2::date AND waktu_selesai < ($2::date + INTERVAL '1 day')`, userID, today)
	if err != nil {
		writeJSONError(w, http.StatusInternalServerError, "Gagal mengambil data")
		return
	}
	defer rows.Close()

	var ids []int
	for rows.Next() {
		var id int
		rows.Scan(&id)
		ids = append(ids, id)
	}
	if ids == nil {
		ids = []int{}
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(ids)
}

func GetUserPoin(w http.ResponseWriter, r *http.Request) {
	enableCORS(w)
	if r.Method == "OPTIONS" {
		return
	}
	authHeader := r.Header.Get("Authorization")
	if !strings.HasPrefix(authHeader, "Bearer ") {
		writeJSONError(w, http.StatusUnauthorized, "Unauthorized")
		return
	}
	tokenStr := strings.TrimPrefix(authHeader, "Bearer ")
	token, _ := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
		return jwtKey, nil
	})
	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok || !token.Valid {
		writeJSONError(w, http.StatusUnauthorized, "Unauthorized")
		return
	}
	userID := int(claims["user_id"].(float64))

	var poin int
	err := config.DB.QueryRow(context.Background(), "SELECT poin FROM users WHERE id=$1", userID).Scan(&poin)
	if err != nil {
		writeJSONError(w, http.StatusInternalServerError, "Gagal mengambil poin")
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]int{"poin": poin})
}

func GetLeaderboard(w http.ResponseWriter, r *http.Request) {
	enableCORS(w)
	if r.Method == "OPTIONS" {
		return
	}

	w.Header().Set("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
	w.Header().Set("Pragma", "no-cache")
	w.Header().Set("Expires", "0")

	rows, err := config.DB.Query(context.Background(),
		"SELECT email, username, poin FROM users ORDER BY poin DESC LIMIT 5")
	if err != nil {
		writeJSONError(w, http.StatusInternalServerError, "Gagal mengambil leaderboard")
		return
	}
	defer rows.Close()

	var leaders []map[string]interface{}
	for rows.Next() {
		var email, username string
		var poin int
		if err := rows.Scan(&email, &username, &poin); err != nil {
			continue
		}

		if username == "" {
			parts := strings.Split(email, "@")
			if len(parts) > 0 {
				username = parts[0]
			}
		}

		leaders = append(leaders, map[string]interface{}{
			"email":    email,
			"username": username,
			"poin":     poin,
		})
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(leaders)
}

func SelesaiTantanganHandler(w http.ResponseWriter, r *http.Request) {
	// Pastikan method POST
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Ambil user_id dari JWT
	authHeader := r.Header.Get("Authorization")
	if !strings.HasPrefix(authHeader, "Bearer ") {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}
	tokenStr := strings.TrimPrefix(authHeader, "Bearer ")
	token, _ := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
		return jwtKey, nil
	})
	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok || !token.Valid {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}
	userID := int(claims["user_id"].(float64))

	// Parse multipart form
	err := r.ParseMultipartForm(10 << 20) // max 10MB
	if err != nil {
		http.Error(w, "Gagal parsing form", http.StatusBadRequest)
		return
	}

	tantanganIDStr := r.FormValue("tantangan_id")

	tantanganID, err := strconv.Atoi(tantanganIDStr)
	if err != nil {
		http.Error(w, "ID tantangan tidak valid", http.StatusBadRequest)
		return
	}

	// Ambil file foto
	file, handler, err := r.FormFile("foto")
	if err != nil {
		http.Error(w, "Foto tidak ditemukan", http.StatusBadRequest)
		return
	}
	defer file.Close()

	// Simpan file ke folder tmp/
	filename := strconv.Itoa(tantanganID) + "_" + strconv.FormatInt(time.Now().Unix(), 10) + filepath.Ext(handler.Filename)
	savePath := filepath.Join("tmp", filename)
	dst, err := os.Create(savePath)
	if err != nil {
		http.Error(w, "Gagal menyimpan foto", http.StatusInternalServerError)
		return
	}
	defer dst.Close()
	_, err = dst.ReadFrom(file)
	if err != nil {
		http.Error(w, "Gagal menyimpan foto", http.StatusInternalServerError)
		return
	}

	// Update status tantangan selesai di database dan tambah poin user
	var count int
	err = config.DB.QueryRow(context.Background(),
		"SELECT COUNT(*) FROM tantangan_user WHERE user_id=$1 AND tantangan_id=$2", userID, tantanganID).Scan(&count)
	if err == nil && count == 0 {
		config.DB.Exec(context.Background(),
			"INSERT INTO tantangan_user (user_id, tantangan_id, status, waktu_selesai, foto_path) VALUES ($1, $2, 'pending', NULL, $3)",
			userID, tantanganID, filename)
		// Jangan update poin di sini!
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(`{"success":true,"message":"Tantangan selesai dan foto berhasil diupload"}`))
}

func GetPendingTantanganUser(w http.ResponseWriter, r *http.Request) {
    enableCORS(w)
    if r.Method != http.MethodGet {
        http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
        return
    }

    rows, err := config.DB.Query(context.Background(),
        `SELECT tu.id, tu.user_id, u.username, tu.tantangan_id, t.judul, tu.status, tu.foto_path
         FROM tantangan_user tu
         JOIN users u ON tu.user_id = u.id
         JOIN tantangan t ON tu.tantangan_id = t.id
         WHERE tu.status = 'pending'
         ORDER BY tu.id DESC`)
    if err != nil {
        http.Error(w, "Gagal mengambil data", http.StatusInternalServerError)
        return
    }
    defer rows.Close()

    var result []map[string]interface{}
    for rows.Next() {
        var id, user_id, tantangan_id int
        var username, judul, status, foto_path string
        if err := rows.Scan(&id, &user_id, &username, &tantangan_id, &judul, &status, &foto_path); err != nil {
            continue
        }
        result = append(result, map[string]interface{}{
            "id":           id,
            "user_id":      user_id,
            "username":     username,
            "tantangan_id": tantangan_id,
            "judul":        judul,
            "status":       status,
            "foto_path":    foto_path,
        })
    }
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(result)
}
