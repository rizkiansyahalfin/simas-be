# simas-be
Sistem Informasi Manajemen Masjid (Backend)


## Keterangan
### NEW RBAC Middleware
Validasi role per endpoint

> Contoh Penggunaan
>
>>router.post(
>>"/articles",
>>authMiddleware,
>>rbacMiddleware("superadmin", "admin_kegiatan"),
>>ArticleController.create
>>)

### NEW Auth Login endpoint
Basic Login endpoint