# simas-be

Sistem Informasi Manajemen Masjid (Backend)

## Branch development

### Semua update sistem dan feature akan di merge ke sini

### Untuk testing dan Pull branch bisa di ambil dari branch ini

## Keterangan:

### feat/be-auth-login-rbac :

#### NEW RBAC Middleware

Validasi role per endpoint

> Contoh Penggunaan
>
> > router.post(
> > "/articles",
> > authMiddleware,
> > rbacMiddleware("superadmin", "admin_kegiatan"),
> > ArticleController.create
> > )

#### NEW Auth Login endpoint

Basic Login endpoint
