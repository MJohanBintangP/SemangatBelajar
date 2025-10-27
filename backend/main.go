package main

import (
	"log"
	"net/http"
	"os"

	"backend/config"
	"backend/handlers"

	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("Tidak ada file .env atau gagal memproses file .env")
	}

	if os.Getenv("DATABASE_URL") == "" {
		log.Fatal("DATABASE_URL is not set")
	}

	config.ConnectDB()
	defer config.DB.Close()

	http.HandleFunc("/api/register", handlers.Register)
	http.HandleFunc("/api/login", handlers.Login)
	http.HandleFunc("/api/laporan", handlers.BuatLaporan)
	http.HandleFunc("/api/laporan/all", handlers.GetAllLaporan)
	http.HandleFunc("/api/laporan/update", handlers.UpdateStatusLaporan)
	http.HandleFunc("/api/laporan/delete", handlers.DeleteLaporan)
	http.HandleFunc("/api/laporan/user", handlers.GetUserLaporan)
	http.HandleFunc("/api/tantangan/hari-ini", handlers.GetTantanganHarian)
	http.HandleFunc("/api/tantangan/selesai-hari-ini", handlers.GetTantanganSelesaiHariIni)
	http.HandleFunc("/api/tantangan/selesai", handlers.SelesaikanTantangan)
	http.HandleFunc("/api/user/poin", handlers.GetUserPoin)
	http.HandleFunc("/api/user/profile", handlers.GetUserProfile)
	http.HandleFunc("/api/leaderboard", handlers.GetLeaderboard)
	http.HandleFunc("/api/forum", handlers.ForumHandler)
	http.HandleFunc("/api/forum/", handlers.TambahKomentarForum)
	http.HandleFunc("/api/artikel", handlers.ProxyArtikelLingkungan)
	http.HandleFunc("/api/user/all", handlers.GetAllUsers)
	http.HandleFunc("/api/forum/delete", handlers.DeleteForum)
	http.HandleFunc("/api/user/delete", handlers.DeleteUser)
	http.HandleFunc("/api/user/update", handlers.UpdateUser)
	http.Handle("/uploads/", http.StripPrefix("/uploads/", http.FileServer(http.Dir("uploads"))))

	log.Println("Server running at :8081")
	log.Fatal(http.ListenAndServe(":8081", nil))
}