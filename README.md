# 🔥 Giàn Phơi Thông Minh - Dashboard IoT

Dashboard điều khiển và giám sát hệ thống giàn phơi thông minh với phong cách **VOLCANIC HELLFIRE** - Địa Ngục Phun Trào.

## 🌋 Tính Năng

### 📊 Trang Tổng Quan (Dashboard)
- Hiển thị thông tin cảm biến realtime:
  - 🌡️ Nhiệt độ
  - 💧 Độ ẩm
  - 🌞 Ánh sáng
  - 🌧️ Mưa
- Điều khiển giàn phơi (Phơi ra / Thu vào / Dừng)
- Chuyển đổi chế độ (Tự động / Thủ công)
- Thống kê hôm nay

### 📜 Trang Lịch Sử
- Bảng lịch sử hoạt động đầy đủ
- Bộ lọc theo ngày
- Phân trang

### 📈 Trang Thống Kê
- Tổng quan 7 ngày gần nhất
- Biểu đồ hoạt động (Chart.js)
- Chi tiết theo từng ngày

## 🛠️ Công Nghệ Sử Dụng

- **Frontend**: React 19 + Vite
- **Styling**: TailwindCSS 3.x
- **Database**: Firebase Realtime Database
- **Routing**: React Router DOM 6.x
- **Charts**: Chart.js + react-chartjs-2
- **UI**: Custom Volcanic Hellfire Design System

## 🎨 Bảng Màu Volcanic Hellfire

| Màu | Hex Code | Tên |
|-----|----------|-----|
| 🔴 | `#ff2200` | Lava Red - Đỏ dung nham |
| 🟠 | `#ff5500` | Fire Orange - Cam lửa |
| 🟡 | `#ffae00` | Molten Yellow - Vàng nóng chảy |
| ⚫ | `#0a0a0a` | Hell Black - Đen địa ngục |
| 🟤 | `#1a0000` | Dark Blood Red - Đỏ máu tối |

## 📦 Cài Đặt

```bash
# Clone repository
git clone https://github.com/NguyenTienDung7749/GianPhoiThongMinh_Website.git

# Di chuyển vào thư mục
cd GianPhoiThongMinh_Website

# Cài đặt dependencies
npm install

# Tạo file .env và cấu hình Firebase
cp .env.example .env
# Điền thông tin Firebase vào file .env

# Chạy development server
npm run dev
```

## ⚙️ Cấu Hình Firebase

Tạo file `.env` với các biến sau:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_DATABASE_URL=your_database_url
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## 📁 Cấu Trúc Dự Án

```
src/
├── components/           # React components
│   ├── Navbar.jsx       # Navigation bar
│   ├── StatusCard.jsx   # Card hiển thị trạng thái
│   ├── FireButton.jsx   # Nút điều khiển
│   ├── HistoryTable.jsx # Bảng lịch sử
│   ├── DailyStats.jsx   # Thống kê theo ngày
│   ├── ChartBlock.jsx   # Biểu đồ
│   └── LoadingHellfire.jsx # Loading animation
│
├── hooks/               # Custom React hooks
│   ├── useRealtimeStatus.js
│   ├── useHistory.js
│   └── useDailyStats.js
│
├── firebase/            # Firebase configuration
│   ├── config.js
│   └── rtdb.js
│
├── pages/               # Page components
│   ├── Dashboard.jsx
│   ├── History.jsx
│   └── Statistics.jsx
│
├── utils/               # Utility functions
│   ├── formatTime.js
│   └── calcDuration.js
│
├── App.jsx             # Main App component
├── main.jsx            # Entry point
└── index.css           # TailwindCSS styles
```

## 🚀 Scripts

```bash
npm run dev      # Chạy development server
npm run build    # Build production
npm run lint     # Kiểm tra code với ESLint
npm run preview  # Preview production build
```

## 📱 Responsive Design

Dashboard được thiết kế responsive, hoạt động tốt trên:
- 📱 Mobile (320px+)
- 📱 Tablet (768px+)
- 💻 Desktop (1024px+)

## 🇻🇳 Việt Hoá

Toàn bộ giao diện được Việt hoá 100%, bao gồm:
- Labels và tiêu đề
- Thông báo và trạng thái
- Định dạng ngày tháng
- Tooltip và hướng dẫn

## 📄 License

MIT License - Xem file [LICENSE](LICENSE) để biết thêm chi tiết.

---

Made with 🔥 by NguyenTienDung7749
