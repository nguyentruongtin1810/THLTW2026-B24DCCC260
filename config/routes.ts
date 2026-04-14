export default [
	{
		path: '/user',
		layout: false,
		routes: [
			{
				path: '/user/login',
				layout: false,
				name: 'login',
				component: './user/Login',
			},
			{
				path: '/user',
				redirect: '/user/login',
			},
		],
	},
	
	{
		path: '/dashboard',
		name: 'Dashboard',
		component: './TrangChu',
		icon: 'HomeOutlined',
	},
	{
		path: '/gioi-thieu',
		name: 'About',
		component: './TienIch/GioiThieu',
		hideInMenu: true,
	},
	{
		path: '/random-user',
		name: 'RandomUser',
		component: './RandomUser',
		icon: 'ArrowsAltOutlined',
	},
	{
		path: '/todo-list',
		name: 'TodoList',
		icon: 'OrderedListOutlined',
		component: './TodoList',
	},
	{
		path: '/guess-number',
		name: 'GuessNumber',
		icon: 'PlayCircleOutlined',
		component: './GuessNumber',
	},
	{
		path: '/study-tracker',
		name: 'Học tập',
		icon: 'BookOutlined',
		component: './StudyTracker',
	},
	{
		path: '/rock-paper-scissors',
		name: 'Oẳn Tù Tì',
		icon: 'PlayCircleOutlined',
		component: './RockPaperScissors',
	},
	{
		path: '/dat-lich-hen',
		name: 'Đặt lịch hẹn',
		icon: 'CalendarOutlined',
		routes: [
			{
				path: '/dat-lich-hen/quan-ly-nhan-vien',
				name: 'Quản lý nhân viên',
				component: './DatLichHen/QuanLyNhanVien',
			},
			{
				path: '/dat-lich-hen/quan-ly-dich-vu',
				name: 'Quản lý dịch vụ',
				component: './DatLichHen/QuanLyDichVu',
			},
			{
				path: '/dat-lich-hen/dat-lich',
				name: 'Đặt lịch hẹn',
				component: './DatLichHen/DatLichHen',
			},
			{
				path: '/dat-lich-hen/quan-ly-lich-hen',
				name: 'Quản lý lịch hẹn',
				component: './DatLichHen/QuanLyLichHen',
			},
			{
				path: '/dat-lich-hen/danh-gia',
				name: 'Đánh giá',
				component: './DatLichHen/DanhGia',
			},
			{
				path: '/dat-lich-hen/thong-ke',
				name: 'Thống kê',
				component: './DatLichHen/ThongKe',
			},
		],
	},
	{
		path: '/quan-ly-san-pham',
		name: 'Quản lý Sản phẩm',
		icon: 'ShoppingOutlined',
		component: './QuanLySanPham',
	},
	{
		path: '/quan-ly-khoa-hoc',
		name: 'Quản lý Khóa học',
		icon: 'BookOutlined',
		component: './QuanLyKhoaHoc',
	},
	{
		path: '/quan-ly-van-bang',
		name: 'Quản lý Văn bằng',
		icon: 'SolutionOutlined',
		component: './QuanLyVanBang',
	},
	{
		path: '/quan-ly-ngan-hang',
		name: 'Quản Lý Ngân Hàng Câu Hỏi',
		icon: 'BankOutlined',
		routes: [
			{
				path: '/quan-ly-ngan-hang/khoi-kien-thuc',
				name: 'Khối Kiến Thức',
				component: './QuanLyNganHang/KhoiKienThuc',
			},
			{
				path: '/quan-ly-ngan-hang/mon-hoc',
				name: 'Môn Học',
				component: './QuanLyNganHang/MonHoc',
			},
			{
				path: '/quan-ly-ngan-hang/cau-hoi',
				name: 'Câu Hỏi',
				component: './QuanLyNganHang/CauHoi',
			},
			{
				path: '/quan-ly-ngan-hang/quan-ly-de-thi',
				name: 'Quản Lý Đề Thi',
				component: './QuanLyNganHang/QuanLyDeThi',
			},
		],
	},

	{
		path: '/quan-ly-cau-lac-bo',
		name: 'Quản lý Câu lạc bộ',
		icon: 'TeamOutlined',
		component: './QuanLyCauLacBo',
	},
	{
		path: '/ke-hoach-du-lich',
		name: 'Kế hoạch du lịch',
		icon: 'CompassOutlined',
		component: './KeHoachDuLich',
	},

	// DANH MUC HE THONG
	// {
	// 	name: 'DanhMuc',
	// 	path: '/danh-muc',
	// 	icon: 'copy',
	// 	routes: [
	// 		{
	// 			name: 'ChucVu',
	// 			path: 'chuc-vu',
	// 			component: './DanhMuc/ChucVu',
	// 		},
	// 	],
	// },

	{
		path: '/notification',
		routes: [
			{
				path: './subscribe',
				exact: true,
				component: './ThongBao/Subscribe',
			},
			{
				path: './check',
				exact: true,
				component: './ThongBao/Check',
			},
			{
				path: './',
				exact: true,
				component: './ThongBao/NotifOneSignal',
			},
		],
		layout: false,
		hideInMenu: true,
	},
	{
		path: '/',
	},
	{
		path: '/403',
		component: './exception/403/403Page',
		layout: false,
	},
	{
		path: '/hold-on',
		component: './exception/DangCapNhat',
		layout: false,
	},
	{
		component: './exception/404',
	},
];
