# simas-be

Sistem Informasi Manajemen Masjid (Backend)

<<<<<<< HEAD
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
=======
# Keterangan

## NEW Users GET/POST/PUT/PATCH endpoint

Fitus khusus super admin untuk menambah, mengubah, dan mengaktif/nonaktifkan users

## NEW Finance Summary

Ringkasan saldo masjid, menckup zis transaction, cash transaction, dan pembagian data perbulan

### Minor changes/updates

#### > Added pagination and optimization for finance
#### > Added zis transaction logic for finance
#### > Updated RBAC middleware for more protection
>>>>>>> parent of d0557e6 (Revert "Feat/be user management page and finance summary")
