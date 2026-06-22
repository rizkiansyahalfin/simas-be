import swaggerJsdoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'SIMAS API - Sistem Informasi Manajemen Masjid',
    version: '1.0.0',
    description: `
API documentation for the SIMAS (Sistem Informasi Manajemen Masjid) backend system.

## Authentication
- **Bearer Token**: Most endpoints require a JWT access token obtained from \`/api/auth/login\`
- The token should be sent as an \`Authorization: Bearer <token>\` header
- Some endpoints are **public** and do not require authentication

## Response Format
Most endpoints respond with:
- \`{ "status": "success", "data": {...} }\` for successful requests
- \`{ "status": "error", "message": "..." }\` for errors
- \`{ "success": true, "data": {...} }\` for some modules

## Roles
- \`superadmin\` - Full system access
- \`bendahara\` - Financial management access
- \`admin_kegiatan\` - Activity/congregation management access
- \`admin_inventaris\` - Inventory management access
`,
    contact: {
      name: 'SIMAS Team',
    },
  },
  servers: [
    {
      url: '/api',
      description: 'API Base Path',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your JWT access token',
      },
    },
    schemas: {
      // ========================
      // COMMON / GENERIC SCHEMAS
      // ========================
      ErrorResponse: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            example: 'error',
          },
          message: {
            type: 'string',
            example: 'Resource not found',
          },
        },
      },
      SuccessResponse: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            example: 'success',
          },
        },
      },
      PaginationMeta: {
        type: 'object',
        properties: {
          page: {
            type: 'integer',
            example: 1,
          },
          limit: {
            type: 'integer',
            example: 10,
          },
          total: {
            type: 'integer',
            example: 50,
          },
          totalPages: {
            type: 'integer',
            example: 5,
          },
        },
      },
      PaginatedResponse: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            example: 'success',
          },
          data: {
            type: 'object',
            properties: {
              items: {
                type: 'array',
                items: {
                  type: 'object',
                },
              },
              pagination: {
                $ref: '#/components/schemas/PaginationMeta',
              },
            },
          },
        },
      },

      // ========================
      // AUTH SCHEMAS
      // ========================
      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: {
            type: 'string',
            format: 'email',
            example: 'admin@masjid.com',
          },
          password: {
            type: 'string',
            format: 'password',
            example: 'password123',
          },
          otpCode: {
            type: 'string',
            description: 'OTP code if 2FA is enabled',
            example: '123456',
          },
        },
      },
      LoginResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true,
          },
          data: {
            type: 'object',
            properties: {
              accessToken: {
                type: 'string',
                example: 'eyJhbGciOiJIUzI1NiIs...',
              },
              user: {
                $ref: '#/components/schemas/UserProfile',
              },
            },
          },
        },
      },
      Login2FARequest: {
        type: 'object',
        required: ['tempToken', 'token'],
        properties: {
          tempToken: {
            type: 'string',
            description: 'Temporary token from initial login response',
          },
          token: {
            type: 'string',
            description: 'OTP code from authenticator app',
            example: '123456',
          },
        },
      },
      RefreshTokenRequest: {
        type: 'object',
        properties: {
          refreshToken: {
            type: 'string',
            description: 'Refresh token (can also be sent via cookie)',
          },
        },
      },
      Setup2FAResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true,
          },
          data: {
            type: 'object',
            properties: {
              secret: {
                type: 'string',
                example: 'JBSWY3DPEHPK3PXP',
              },
              qrCodeUrl: {
                type: 'string',
                example: 'otpauth://totp/SIMAS:user@masjid.com?secret=...',
              },
            },
          },
        },
      },
      Verify2FARequest: {
        type: 'object',
        required: ['otpCode'],
        properties: {
          otpCode: {
            type: 'string',
            description: 'OTP code from authenticator app',
            example: '123456',
          },
        },
      },
      ForgotPasswordRequest: {
        type: 'object',
        required: ['email'],
        properties: {
          email: {
            type: 'string',
            format: 'email',
            example: 'user@masjid.com',
          },
        },
      },
      ResetPasswordRequest: {
        type: 'object',
        required: ['token', 'password'],
        properties: {
          token: {
            type: 'string',
            description: 'Reset token received via email',
          },
          password: {
            type: 'string',
            format: 'password',
            minLength: 8,
            example: 'newPassword123',
          },
        },
      },

      // ========================
      // USER / PROFILE SCHEMAS
      // ========================
      UserProfile: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          username: { type: 'string', example: 'admin' },
          email: { type: 'string', format: 'email', example: 'admin@masjid.com' },
          role: {
            type: 'string',
            enum: ['superadmin', 'bendahara', 'admin_kegiatan', 'admin_inventaris'],
            example: 'superadmin',
          },
          isActive: { type: 'boolean', example: true },
          profileImage: { type: 'string', nullable: true, example: 'profile-123.jpg' },
          twoFactorEnabled: { type: 'boolean', example: false },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      CreateUserRequest: {
        type: 'object',
        required: ['username', 'email', 'password', 'role'],
        properties: {
          username: { type: 'string', example: 'newuser' },
          email: { type: 'string', format: 'email', example: 'newuser@masjid.com' },
          password: { type: 'string', format: 'password', minLength: 8, example: 'password123' },
          role: {
            type: 'string',
            enum: ['superadmin', 'bendahara', 'admin_kegiatan', 'admin_inventaris'],
            example: 'bendahara',
          },
        },
      },
      UpdateUserRequest: {
        type: 'object',
        properties: {
          username: { type: 'string', example: 'updateduser' },
          email: { type: 'string', format: 'email', example: 'updated@masjid.com' },
          role: {
            type: 'string',
            enum: ['superadmin', 'bendahara', 'admin_kegiatan', 'admin_inventaris'],
          },
        },
      },
      ChangePasswordRequest: {
        type: 'object',
        required: ['currentPassword', 'newPassword'],
        properties: {
          currentPassword: { type: 'string', format: 'password' },
          newPassword: { type: 'string', format: 'password', minLength: 8 },
        },
      },
      UpdateProfileRequest: {
        type: 'object',
        properties: {
          username: { type: 'string', example: 'myusername' },
          email: { type: 'string', format: 'email', example: 'me@masjid.com' },
        },
      },

      // ========================
      // FINANCE - CASH SCHEMAS
      // ========================
      CashTransaction: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          date: { type: 'string', format: 'date', example: '2024-01-15' },
          type: { type: 'string', enum: ['income', 'expense'], example: 'income' },
          category: { type: 'string', example: 'Donasi' },
          amount: { type: 'number', example: 500000 },
          description: { type: 'string', example: 'Donasi rutin Jumat' },
          createdBy: { type: 'integer', example: 1 },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      CreateCashRequest: {
        type: 'object',
        required: ['date', 'type', 'category', 'amount', 'description'],
        properties: {
          date: { type: 'string', format: 'date', example: '2024-01-15' },
          type: { type: 'string', enum: ['income', 'expense'], example: 'income' },
          category: { type: 'string', example: 'Donasi' },
          amount: { type: 'number', example: 500000 },
          description: { type: 'string', example: 'Donasi rutin Jumat' },
        },
      },
      UpdateCashRequest: {
        type: 'object',
        properties: {
          date: { type: 'string', format: 'date', example: '2024-01-15' },
          type: { type: 'string', enum: ['income', 'expense'], example: 'income' },
          category: { type: 'string', example: 'Donasi' },
          amount: { type: 'number', example: 500000 },
          description: { type: 'string', example: 'Updated description' },
        },
      },

      // ========================
      // FINANCE - ZIS SCHEMAS
      // ========================
      ZisTransaction: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          date: { type: 'string', format: 'date', example: '2024-01-15' },
          type: { type: 'string', enum: ['income', 'expense'], example: 'income' },
          zisCategory: {
            type: 'string',
            enum: ['zakat', 'infaq', 'shadaqah'],
            example: 'zakat',
          },
          amount: { type: 'number', example: 1000000 },
          description: { type: 'string', example: 'Zakat fitrah' },
          createdBy: { type: 'integer', example: 1 },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      CreateZisRequest: {
        type: 'object',
        required: ['date', 'type', 'zisCategory', 'amount', 'description'],
        properties: {
          date: { type: 'string', format: 'date', example: '2024-01-15' },
          type: { type: 'string', enum: ['income', 'expense'], example: 'income' },
          zisCategory: {
            type: 'string',
            enum: ['zakat', 'infaq', 'shadaqah'],
            example: 'zakat',
          },
          amount: { type: 'number', example: 1000000 },
          description: { type: 'string', example: 'Zakat fitrah' },
        },
      },
      UpdateZisRequest: {
        type: 'object',
        properties: {
          date: { type: 'string', format: 'date', example: '2024-01-15' },
          type: { type: 'string', enum: ['income', 'expense'] },
          zisCategory: {
            type: 'string',
            enum: ['zakat', 'infaq', 'shadaqah'],
          },
          amount: { type: 'number', example: 1000000 },
          description: { type: 'string', example: 'Updated description' },
        },
      },
      FinanceSummary: {
        type: 'object',
        properties: {
          totalCashIncome: { type: 'number', example: 50000000 },
          totalCashExpense: { type: 'number', example: 20000000 },
          cashBalance: { type: 'number', example: 30000000 },
          totalZisIncome: { type: 'number', example: 25000000 },
          totalZisExpense: { type: 'number', example: 10000000 },
          zisBalance: { type: 'number', example: 15000000 },
          totalIncome: { type: 'number', example: 75000000 },
          totalExpense: { type: 'number', example: 30000000 },
          netBalance: { type: 'number', example: 45000000 },
        },
      },

      // ========================
      // JUMAT SCHEDULES SCHEMAS
      // ========================
      JumatSchedule: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          date: { type: 'string', format: 'date', example: '2024-01-19' },
          imam: { type: 'string', example: 'Ustadz Ahmad' },
          khatib: { type: 'string', example: 'Ustadz Abdullah' },
          muadzin: { type: 'string', example: 'Bilal' },
          notes: { type: 'string', example: 'Minggu ke-3' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      CreateJumatScheduleRequest: {
        type: 'object',
        required: ['date', 'imam', 'khatib'],
        properties: {
          date: { type: 'string', format: 'date', example: '2024-01-19' },
          imam: { type: 'string', example: 'Ustadz Ahmad' },
          khatib: { type: 'string', example: 'Ustadz Abdullah' },
          muadzin: { type: 'string', example: 'Bilal' },
          notes: { type: 'string', example: 'Minggu ke-3' },
        },
      },
      UpdateJumatScheduleRequest: {
        type: 'object',
        properties: {
          date: { type: 'string', format: 'date', example: '2024-01-19' },
          imam: { type: 'string', example: 'Ustadz Ahmad' },
          khatib: { type: 'string', example: 'Ustadz Abdullah' },
          muadzin: { type: 'string', example: 'Bilal' },
          notes: { type: 'string', example: 'Minggu ke-3' },
        },
      },

      // ========================
      // CONGREGATION SCHEMAS
      // ========================
      Congregation: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'Ahmad Fauzi' },
          phone: { type: 'string', example: '08123456789' },
          address: { type: 'string', example: 'Jl. Masjid No. 1' },
          isActive: { type: 'boolean', example: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      CreateCongregationRequest: {
        type: 'object',
        required: ['name', 'phone'],
        properties: {
          name: { type: 'string', example: 'Ahmad Fauzi' },
          phone: { type: 'string', example: '08123456789' },
          address: { type: 'string', example: 'Jl. Masjid No. 1' },
        },
      },
      UpdateCongregationRequest: {
        type: 'object',
        properties: {
          name: { type: 'string', example: 'Ahmad Fauzi' },
          phone: { type: 'string', example: '08123456789' },
          address: { type: 'string', example: 'Jl. Masjid No. 1' },
        },
      },

      // ========================
      // INVENTORY SCHEMAS
      // ========================
      InventoryItem: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'Mikrofon Wireless' },
          categoryId: { type: 'integer', example: 1 },
          category: { type: 'string', example: 'Elektronik' },
          condition: {
            type: 'string',
            enum: ['baik', 'rusak_ringan', 'rusak_berat', 'hilang'],
            example: 'baik',
          },
          quantity: { type: 'integer', example: 5 },
          description: { type: 'string', example: 'Mikrofon untuk kajian' },
          photo: { type: 'string', nullable: true, example: 'inventory-123.jpg' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      CreateInventoryRequest: {
        type: 'object',
        required: ['name', 'categoryId', 'condition', 'quantity'],
        properties: {
          name: { type: 'string', example: 'Mikrofon Wireless' },
          categoryId: { type: 'integer', example: 1 },
          condition: {
            type: 'string',
            enum: ['baik', 'rusak_ringan', 'rusak_berat', 'hilang'],
            example: 'baik',
          },
          quantity: { type: 'integer', example: 5 },
          description: { type: 'string', example: 'Mikrofon untuk kajian' },
        },
      },
      UpdateInventoryRequest: {
        type: 'object',
        properties: {
          name: { type: 'string', example: 'Mikrofon Wireless' },
          categoryId: { type: 'integer', example: 1 },
          condition: {
            type: 'string',
            enum: ['baik', 'rusak_ringan', 'rusak_berat', 'hilang'],
          },
          quantity: { type: 'integer', example: 5 },
          description: { type: 'string', example: 'Updated description' },
        },
      },

      // ========================
      // INVENTORY CATEGORY SCHEMAS
      // ========================
      InventoryCategory: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'Elektronik' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      CreateInventoryCategoryRequest: {
        type: 'object',
        required: ['name'],
        properties: {
          name: { type: 'string', example: 'Elektronik' },
        },
      },
      UpdateInventoryCategoryRequest: {
        type: 'object',
        properties: {
          name: { type: 'string', example: 'Elektronik & Multimedia' },
        },
      },

      // ========================
      // INVENTORY LOAN SCHEMAS
      // ========================
      InventoryLoan: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          inventoryId: { type: 'integer', example: 1 },
          inventoryName: { type: 'string', example: 'Mikrofon Wireless' },
          borrowerName: { type: 'string', example: 'Ahmad' },
          quantity: { type: 'integer', example: 2 },
          loanDate: { type: 'string', format: 'date', example: '2024-01-10' },
          dueDate: { type: 'string', format: 'date', example: '2024-01-17' },
          returnDate: { type: 'string', format: 'date', nullable: true },
          status: {
            type: 'string',
            enum: ['borrowed', 'returned', 'overdue'],
            example: 'borrowed',
          },
          notes: { type: 'string', example: 'Untuk acara kajian' },
          createdBy: { type: 'integer', example: 1 },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      CreateInventoryLoanRequest: {
        type: 'object',
        required: ['inventoryId', 'borrowerName', 'quantity', 'loanDate', 'dueDate'],
        properties: {
          inventoryId: { type: 'integer', example: 1 },
          borrowerName: { type: 'string', example: 'Ahmad' },
          quantity: { type: 'integer', example: 2 },
          loanDate: { type: 'string', format: 'date', example: '2024-01-10' },
          dueDate: { type: 'string', format: 'date', example: '2024-01-17' },
          notes: { type: 'string', example: 'Untuk acara kajian' },
        },
      },
      ReturnInventoryLoanRequest: {
        type: 'object',
        required: ['condition'],
        properties: {
          condition: {
            type: 'string',
            enum: ['baik', 'rusak_ringan', 'rusak_berat'],
            example: 'baik',
          },
          notes: { type: 'string', example: 'Dikembalikan dalam kondisi baik' },
        },
      },

      // ========================
      // EVENT SCHEMAS
      // ========================
      Event: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          title: { type: 'string', example: 'Kajian Rutin Ahad' },
          description: { type: 'string', example: 'Kajian pekanan' },
          date: { type: 'string', format: 'date', example: '2024-01-21' },
          startTime: { type: 'string', example: '08:00' },
          endTime: { type: 'string', example: '10:00' },
          location: { type: 'string', example: 'Masjid At-Taqwa' },
          poster: { type: 'string', nullable: true, example: 'poster-123.jpg' },
          status: {
            type: 'string',
            enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
            example: 'upcoming',
          },
          createdBy: { type: 'integer', example: 1 },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      CreateEventRequest: {
        type: 'object',
        required: ['title', 'date', 'startTime', 'endTime', 'location'],
        properties: {
          title: { type: 'string', example: 'Kajian Rutin Ahad' },
          description: { type: 'string', example: 'Kajian pekanan' },
          date: { type: 'string', format: 'date', example: '2024-01-21' },
          startTime: { type: 'string', example: '08:00' },
          endTime: { type: 'string', example: '10:00' },
          location: { type: 'string', example: 'Masjid At-Taqwa' },
        },
      },
      UpdateEventStatusRequest: {
        type: 'object',
        required: ['status'],
        properties: {
          status: {
            type: 'string',
            enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
            example: 'completed',
          },
        },
      },

      // ========================
      // ARTICLE SCHEMAS
      // ========================
      Article: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          title: { type: 'string', example: 'Keutamaan Sholat Berjamaah' },
          content: { type: 'string', example: 'Lorem ipsum...' },
          categoryId: { type: 'integer', example: 1 },
          category: { type: 'string', example: 'Kajian' },
          authorId: { type: 'integer', example: 1 },
          authorName: { type: 'string', example: 'Admin' },
          isPublished: { type: 'boolean', example: true },
          publishedAt: { type: 'string', format: 'date-time', nullable: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      CreateArticleRequest: {
        type: 'object',
        required: ['title', 'content', 'categoryId'],
        properties: {
          title: { type: 'string', example: 'Keutamaan Sholat Berjamaah' },
          content: { type: 'string', example: 'Artikel tentang sholat...' },
          categoryId: { type: 'integer', example: 1 },
        },
      },
      ArticleCategory: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'Kajian' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      CreateArticleCategoryRequest: {
        type: 'object',
        required: ['name'],
        properties: {
          name: { type: 'string', example: 'Kajian' },
        },
      },

      // ========================
      // DONATION SCHEMAS
      // ========================
      Donation: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          donorName: { type: 'string', example: 'Ahmad Fauzi' },
          donorEmail: { type: 'string', format: 'email', example: 'ahmad@email.com' },
          amount: { type: 'number', example: 500000 },
          categoryId: { type: 'integer', example: 1 },
          categoryName: { type: 'string', example: 'Donasi Umum' },
          message: { type: 'string', example: 'Semoga berkah' },
          proofImage: { type: 'string', nullable: true },
          status: {
            type: 'string',
            enum: ['pending', 'verified', 'rejected'],
            example: 'pending',
          },
          paymentMethod: { type: 'string', example: 'TRANSFER' },
          verifiedBy: { type: 'integer', nullable: true },
          verifiedAt: { type: 'string', format: 'date-time', nullable: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      SubmitDonationRequest: {
        type: 'object',
        required: ['donorName', 'donorEmail', 'amount', 'categoryId'],
        properties: {
          donorName: { type: 'string', example: 'Ahmad Fauzi' },
          donorEmail: { type: 'string', format: 'email', example: 'ahmad@email.com' },
          amount: { type: 'number', example: 500000 },
          categoryId: { type: 'integer', example: 1 },
          message: { type: 'string', example: 'Semoga berkah' },
          paymentMethod: { type: 'string', example: 'TRANSFER' },
        },
      },
      RejectDonationRequest: {
        type: 'object',
        required: ['note'],
        properties: {
          note: { type: 'string', example: 'Bukti transfer tidak jelas' },
        },
      },
      DonationStats: {
        type: 'object',
        properties: {
          totalDonations: { type: 'integer', example: 150 },
          totalAmount: { type: 'number', example: 75000000 },
          averageAmount: { type: 'number', example: 500000 },
          thisMonth: { type: 'number', example: 5000000 },
          statusCounts: {
            type: 'object',
            properties: {
              pending: { type: 'integer', example: 10 },
              verified: { type: 'integer', example: 130 },
              rejected: { type: 'integer', example: 10 },
            },
          },
        },
      },

      // ========================
      // MUSTAHIK SCHEMAS
      // ========================
      Mustahik: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'Fatimah' },
          phone: { type: 'string', example: '08123456789' },
          address: { type: 'string', example: 'Jl. Melati No. 5' },
          category: {
            type: 'string',
            enum: ['fakir', 'miskin', 'amil', 'muallaf', 'riqab', 'gharim', 'fisabilillah', 'ibnu_sabil'],
            example: 'fakir',
          },
          description: { type: 'string', example: 'Kepala keluarga 5 orang' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      CreateMustahikRequest: {
        type: 'object',
        required: ['name', 'phone', 'category'],
        properties: {
          name: { type: 'string', example: 'Fatimah' },
          phone: { type: 'string', example: '08123456789' },
          address: { type: 'string', example: 'Jl. Melati No. 5' },
          category: {
            type: 'string',
            enum: ['fakir', 'miskin', 'amil', 'muallaf', 'riqab', 'gharim', 'fisabilillah', 'ibnu_sabil'],
            example: 'fakir',
          },
          description: { type: 'string', example: 'Kepala keluarga 5 orang' },
        },
      },

      // ========================
      // MUSTAHIK DISTRIBUTION SCHEMAS
      // ========================
      MustahikDistribution: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          mustahikId: { type: 'integer', example: 1 },
          mustahikName: { type: 'string', example: 'Fatimah' },
          amount: { type: 'number', example: 500000 },
          type: { type: 'string', enum: ['zakat', 'infaq', 'shadaqah'], example: 'zakat' },
          date: { type: 'string', format: 'date', example: '2024-01-15' },
          notes: { type: 'string', example: 'Distribusi bulanan' },
          createdBy: { type: 'integer', example: 1 },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      CreateDistributionRequest: {
        type: 'object',
        required: ['mustahikId', 'amount', 'type', 'date'],
        properties: {
          mustahikId: { type: 'integer', example: 1 },
          amount: { type: 'number', example: 500000 },
          type: { type: 'string', enum: ['zakat', 'infaq', 'shadaqah'], example: 'zakat' },
          date: { type: 'string', format: 'date', example: '2024-01-15' },
          notes: { type: 'string', example: 'Distribusi bulanan' },
        },
      },

      // ========================
      // PRAYER SCHEMAS
      // ========================
      PrayerSchedule: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          date: { type: 'string', format: 'date', example: '2024-01-15' },
          city: { type: 'string', example: 'Jakarta' },
          subuh: { type: 'string', example: '04:30' },
          dzuhur: { type: 'string', example: '12:00' },
          ashar: { type: 'string', example: '15:15' },
          maghrib: { type: 'string', example: '18:00' },
          isya: { type: 'string', example: '19:15' },
        },
      },

      // ========================
      // MOSQUE PROFILE SCHEMAS
      // ========================
      MosqueProfile: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'Masjid At-Taqwa' },
          address: { type: 'string', example: 'Jl. Raya Masjid No. 1' },
          city: { type: 'string', example: 'Jakarta' },
          phone: { type: 'string', example: '021-12345678' },
          email: { type: 'string', format: 'email', example: 'info@masjid.com' },
          description: { type: 'string', example: 'Masjid utama di wilayah ini' },
          logo: { type: 'string', nullable: true },
          qrisImage: { type: 'string', nullable: true },
          bankName: { type: 'string', example: 'Bank Syariah' },
          bankAccount: { type: 'string', example: '1234567890' },
          bankAccountName: { type: 'string', example: 'Masjid At-Taqwa' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      PublicConfig: {
        type: 'object',
        properties: {
          mosqueName: { type: 'string', example: 'Masjid At-Taqwa' },
          city: { type: 'string', example: 'Jakarta' },
          donationConfig: {
            type: 'object',
            properties: {
              bankName: { type: 'string' },
              bankAccount: { type: 'string' },
              bankAccountName: { type: 'string' },
              qrisImage: { type: 'string' },
            },
          },
        },
      },

      // ========================
      // CAMPAIGN SCHEMAS
      // ========================
      Campaign: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          title: { type: 'string', example: 'Pembangunan Sayap Barat' },
          description: { type: 'string', example: 'Penggalangan dana untuk pembangunan' },
          targetAmount: { type: 'number', example: 500000000 },
          collectedAmount: { type: 'number', example: 250000000 },
          status: {
            type: 'string',
            enum: ['active', 'completed', 'cancelled', 'draft'],
            example: 'active',
          },
          startDate: { type: 'string', format: 'date', example: '2024-01-01' },
          endDate: { type: 'string', format: 'date', nullable: true, example: '2024-06-30' },
          createdBy: { type: 'integer', example: 1 },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      CreateCampaignRequest: {
        type: 'object',
        required: ['title', 'targetAmount', 'startDate'],
        properties: {
          title: { type: 'string', example: 'Pembangunan Sayap Barat' },
          description: { type: 'string', example: 'Penggalangan dana untuk pembangunan' },
          targetAmount: { type: 'number', example: 500000000 },
          startDate: { type: 'string', format: 'date', example: '2024-01-01' },
          endDate: { type: 'string', format: 'date', nullable: true },
        },
      },
      CampaignProgress: {
        type: 'object',
        properties: {
          campaignId: { type: 'integer', example: 1 },
          title: { type: 'string', example: 'Pembangunan Sayap Barat' },
          targetAmount: { type: 'number', example: 500000000 },
          collectedAmount: { type: 'number', example: 250000000 },
          percentage: { type: 'number', example: 50 },
          remainingAmount: { type: 'number', example: 250000000 },
          daysRemaining: { type: 'integer', nullable: true, example: 90 },
          status: { type: 'string', example: 'active' },
        },
      },

      // ========================
      // NOTIFICATION SCHEMAS
      // ========================
      Notification: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          type: {
            type: 'string',
            enum: ['donation', 'event', 'inventory', 'campaign', 'system', 'warning'],
            example: 'donation',
          },
          title: { type: 'string', example: 'Donasi Baru' },
          message: { type: 'string', example: 'Donasi Rp500.000 dari Ahmad' },
          isRead: { type: 'boolean', example: false },
          link: { type: 'string', nullable: true },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },

      // ========================
      // ATTENDANCE SCHEMAS
      // ========================
      AttendanceSession: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          title: { type: 'string', example: 'Kajian Ahad Pagi' },
          sessionType: {
            type: 'string',
            enum: ['prayer', 'event'],
            example: 'event',
          },
          date: { type: 'string', format: 'date', example: '2024-01-21' },
          startTime: { type: 'string', example: '08:00' },
          endTime: { type: 'string', example: '10:00' },
          location: { type: 'string', example: 'Masjid At-Taqwa' },
          createdBy: { type: 'integer', example: 1 },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      CreateAttendanceSessionRequest: {
        type: 'object',
        required: ['title', 'sessionType', 'date', 'startTime', 'endTime'],
        properties: {
          title: { type: 'string', example: 'Kajian Ahad Pagi' },
          sessionType: {
            type: 'string',
            enum: ['prayer', 'event'],
            example: 'event',
          },
          date: { type: 'string', format: 'date', example: '2024-01-21' },
          startTime: { type: 'string', example: '08:00' },
          endTime: { type: 'string', example: '10:00' },
          location: { type: 'string', example: 'Masjid At-Taqwa' },
        },
      },
      CheckInRequest: {
        type: 'object',
        required: ['sessionId', 'congregationId', 'checkInMethod'],
        properties: {
          sessionId: { type: 'integer', example: 1 },
          congregationId: { type: 'integer', example: 1 },
          checkInMethod: {
            type: 'string',
            enum: ['qr_code', 'manual'],
            example: 'manual',
          },
        },
      },

      // ========================
      // PAYMENT SCHEMAS
      // ========================
      PaymentTransaction: {
        type: 'object',
        properties: {
          orderId: { type: 'string', example: 'DON-123456' },
          grossAmount: { type: 'number', example: 500000 },
          transactionStatus: { type: 'string', example: 'settlement' },
          paymentType: { type: 'string', example: 'bank_transfer' },
          transactionTime: { type: 'string', format: 'date-time' },
          vaNumber: { type: 'string', example: '1234567890' },
          bank: { type: 'string', example: 'bca' },
        },
      },
      CreatePaymentRequest: {
        type: 'object',
        required: ['orderId', 'grossAmount'],
        properties: {
          orderId: { type: 'string', example: 'DON-123456' },
          grossAmount: { type: 'number', example: 500000 },
          customerDetails: {
            type: 'object',
            properties: {
              firstName: { type: 'string', example: 'Ahmad' },
              email: { type: 'string', format: 'email', example: 'ahmad@email.com' },
              phone: { type: 'string', example: '08123456789' },
            },
          },
        },
      },
      RefundRequest: {
        type: 'object',
        properties: {
          reason: { type: 'string', example: 'Duplicate payment' },
          amount: { type: 'number', example: 500000 },
        },
      },

      // ========================
      // AUDIT SCHEMAS
      // ========================
      AuditLog: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          userId: { type: 'integer', example: 1 },
          username: { type: 'string', example: 'admin' },
          action: {
            type: 'string',
            enum: ['create', 'update', 'delete'],
            example: 'create',
          },
          module: { type: 'string', example: 'finance.cash' },
          entityId: { type: 'integer', nullable: true, example: 1 },
          description: { type: 'string', example: 'Menambah transaksi kas' },
          ipAddress: { type: 'string', example: '192.168.1.1' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },

      // ========================
      // BACKUP SCHEMAS
      // ========================
      BackupInfo: {
        type: 'object',
        properties: {
          fileName: { type: 'string', example: 'backup-2024-01-15.sql.gz' },
          fileSize: { type: 'string', example: '2.5 MB' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      RestoreValidation: {
        type: 'object',
        properties: {
          valid: { type: 'boolean', example: true },
          tableCount: { type: 'integer', example: 15 },
          recordCount: { type: 'integer', example: 1000 },
          restoreToken: { type: 'string', example: 'restore-token-xxx' },
        },
      },
      ConfirmRestoreRequest: {
        type: 'object',
        required: ['restoreToken'],
        properties: {
          restoreToken: { type: 'string', example: 'restore-token-xxx' },
        },
      },

      // ========================
      // DASHBOARD SCHEMAS
      // ========================
      DashboardStats: {
        type: 'object',
        properties: {
          totalCongregations: { type: 'integer', example: 500 },
          totalDonations: { type: 'integer', example: 150 },
          donationAmount: { type: 'number', example: 75000000 },
          cashBalance: { type: 'number', example: 30000000 },
          zisBalance: { type: 'number', example: 15000000 },
          totalInventory: { type: 'integer', example: 50 },
          activeLoans: { type: 'integer', example: 5 },
          upcomingEvents: { type: 'integer', example: 3 },
        },
      },
      ChartData: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            month: { type: 'string', example: '2024-01' },
            income: { type: 'number', example: 10000000 },
            expense: { type: 'number', example: 5000000 },
          },
        },
      },

      // ========================
      // HEALTH SCHEMAS
      // ========================
      BasicHealth: {
        type: 'object',
        properties: {
          status: { type: 'string', example: 'healthy' },
          timestamp: { type: 'string', format: 'date-time' },
          uptime: { type: 'number', example: 3600 },
        },
      },
      DetailedHealth: {
        type: 'object',
        properties: {
          status: { type: 'string', example: 'healthy' },
          timestamp: { type: 'string', format: 'date-time' },
          uptime: { type: 'number', example: 3600 },
          database: { type: 'string', example: 'connected' },
          redis: { type: 'string', example: 'connected' },
          memory: {
            type: 'object',
            properties: {
              used: { type: 'string', example: '120 MB' },
              total: { type: 'string', example: '512 MB' },
            },
          },
          disk: {
            type: 'object',
            properties: {
              free: { type: 'string', example: '50 GB' },
              total: { type: 'string', example: '100 GB' },
            },
          },
        },
      },

      // ========================
      // GALLERY SCHEMAS
      // ========================
      GalleryImage: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          filename: { type: 'string', example: 'gallery-abc123.jpg' },
          originalName: { type: 'string', example: 'kegiatan.jpg' },
          url: { type: 'string', example: '/uploads/gallery-abc123.jpg' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  },
  tags: [
    { name: 'Auth', description: 'Authentication & Authorization endpoints' },
    { name: 'Users', description: 'User management endpoints' },
    { name: 'Finance - Cash', description: 'Cash transaction management' },
    { name: 'Finance - ZIS', description: 'Zakat, Infaq, Shadaqah management' },
    { name: 'Finance - Summary', description: 'Finance summary & reports' },
    { name: 'Jumat Schedules', description: 'Friday prayer schedule management' },
    { name: 'Congregation', description: 'Congregation/membership management' },
    { name: 'Inventory', description: 'Inventory items management' },
    { name: 'Inventory Categories', description: 'Inventory category management' },
    { name: 'Inventory Loans', description: 'Inventory loan management' },
    { name: 'Events', description: 'Event management' },
    { name: 'Reports', description: 'Exportable reports (Excel/PDF)' },
    { name: 'Gallery', description: 'Photo gallery management' },
    { name: 'Articles', description: 'Article content management' },
    { name: 'Article Categories', description: 'Article category management' },
    { name: 'Donations', description: 'Donation submission & management' },
    { name: 'Mustahik', description: 'Mustahik (beneficiary) management' },
    { name: 'Mustahik Distribution', description: 'ZIS distribution to mustahik' },
    { name: 'Prayer', description: 'Prayer schedule management' },
    { name: 'Dashboard', description: 'Dashboard statistics & charts' },
    { name: 'Mosque Profile', description: 'Mosque profile & configuration' },
    { name: 'Campaigns', description: 'Fundraising campaign management' },
    { name: 'Audit', description: 'Audit log monitoring' },
    { name: 'Notifications', description: 'Notification system' },
    { name: 'Attendance', description: 'Attendance session management' },
    { name: 'Payments', description: 'Midtrans payment integration' },
    { name: 'Backup', description: 'Database backup & restore' },
    { name: 'Health', description: 'System health check' },
  ],
  paths: {
    // ========================
    // AUTH PATHS
    // ========================
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login to the system',
        description: 'Authenticate with email and password. Returns JWT access token and sets refresh token cookie.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginRequest' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Login successful (or 2FA required)',
            content: {
              'application/json': {
                schema: {
                  oneOf: [
                    {
                      type: 'object',
                      properties: {
                        success: { type: 'boolean', example: true },
                        data: {
                          type: 'object',
                          properties: {
                            requires2FA: { type: 'boolean', example: true },
                            tempToken: { type: 'string' },
                          },
                        },
                      },
                    },
                    {
                      $ref: '#/components/schemas/LoginResponse',
                    },
                  ],
                },
              },
            },
          },
          '401': {
            description: 'Invalid credentials',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
          },
        },
      },
    },
    '/auth/login/2fa': {
      post: {
        tags: ['Auth'],
        summary: 'Verify 2FA during login',
        description: 'Complete login with 2FA using temporary token and OTP code.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Login2FARequest' },
            },
          },
        },
        responses: {
          '200': {
            description: '2FA verification successful',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginResponse' } } },
          },
        },
      },
    },
    '/auth/refresh': {
      post: {
        tags: ['Auth'],
        summary: 'Refresh access token',
        description: 'Get a new access token using refresh token.',
        responses: {
          '200': {
            description: 'Token refreshed successfully',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginResponse' } } },
          },
          '401': {
            description: 'Invalid or missing refresh token',
          },
        },
      },
    },
    '/auth/2fa/setup': {
      post: {
        tags: ['Auth'],
        summary: 'Setup 2FA',
        description: 'Initialize two-factor authentication setup. Returns secret and QR code URL.',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: '2FA setup initialized',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Setup2FAResponse' } } },
          },
        },
      },
    },
    '/auth/2fa/verify': {
      post: {
        tags: ['Auth'],
        summary: 'Verify 2FA setup',
        description: 'Verify and enable 2FA by confirming OTP code.',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Verify2FARequest' },
            },
          },
        },
        responses: {
          '200': {
            description: '2FA enabled successfully',
          },
        },
      },
    },
    '/auth/2fa/disable': {
      post: {
        tags: ['Auth'],
        summary: 'Disable 2FA',
        description: 'Disable two-factor authentication.',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Verify2FARequest' },
            },
          },
        },
        responses: {
          '200': {
            description: '2FA disabled successfully',
          },
        },
      },
    },
    '/auth/forgot-password': {
      post: {
        tags: ['Auth'],
        summary: 'Forgot password',
        description: 'Request password reset link via email.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ForgotPasswordRequest' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Reset link sent if email exists',
          },
        },
      },
    },
    '/auth/reset-password': {
      post: {
        tags: ['Auth'],
        summary: 'Reset password',
        description: 'Reset password using token from email.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ResetPasswordRequest' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Password reset successful',
          },
        },
      },
    },
    '/auth/logout': {
      post: {
        tags: ['Auth'],
        summary: 'Logout',
        description: 'Logout and invalidate refresh token.',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Logout successful',
          },
        },
      },
    },
    '/auth/change-password': {
      put: {
        tags: ['Auth'],
        summary: 'Change password',
        description: 'Change current user password.',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ChangePasswordRequest' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Password changed successfully',
          },
        },
      },
    },

    // ========================
    // USERS PATHS
    // ========================
    '/users': {
      get: {
        tags: ['Users'],
        summary: 'List all users',
        description: 'Get paginated list of users. Superadmin only.',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
          { name: 'role', in: 'query', schema: { type: 'string', enum: ['superadmin', 'bendahara', 'admin_kegiatan', 'admin_inventaris'] } },
          { name: 'isActive', in: 'query', schema: { type: 'boolean' } },
        ],
        responses: {
          '200': {
            description: 'List of users',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: {
                      type: 'object',
                      properties: {
                        items: {
                          type: 'array',
                          items: { $ref: '#/components/schemas/UserProfile' },
                        },
                        pagination: { $ref: '#/components/schemas/PaginationMeta' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Users'],
        summary: 'Create user',
        description: 'Create a new user account. Superadmin only.',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateUserRequest' },
            },
          },
        },
        responses: {
          '201': {
            description: 'User created successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: { $ref: '#/components/schemas/UserProfile' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/users/{id}': {
      put: {
        tags: ['Users'],
        summary: 'Update user',
        description: 'Update user details. Superadmin only.',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateUserRequest' },
            },
          },
        },
        responses: {
          '200': {
            description: 'User updated',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: { $ref: '#/components/schemas/UserProfile' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/users/{id}/activate': {
      patch: {
        tags: ['Users'],
        summary: 'Activate user',
        description: 'Activate a deactivated user. Superadmin only.',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
        ],
        responses: {
          '200': {
            description: 'User activated',
          },
        },
      },
    },
    '/users/{id}/deactivate': {
      patch: {
        tags: ['Users'],
        summary: 'Deactivate user',
        description: 'Deactivate a user account. Superadmin only.',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
        ],
        responses: {
          '200': {
            description: 'User deactivated',
          },
        },
      },
    },
    '/users/profile': {
      get: {
        tags: ['Users'],
        summary: 'Get profile',
        description: 'Get current user profile.',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'User profile',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: { $ref: '#/components/schemas/UserProfile' },
                  },
                },
              },
            },
          },
        },
      },
      put: {
        tags: ['Users'],
        summary: 'Update profile',
        description: 'Update current user profile with optional photo upload.',
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  username: { type: 'string' },
                  email: { type: 'string', format: 'email' },
                  photo: { type: 'string', format: 'binary' },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Profile updated',
          },
        },
      },
    },

    // ========================
    // FINANCE CASH PATHS
    // ========================
    '/finance/cash': {
      get: {
        tags: ['Finance - Cash'],
        summary: 'List cash transactions',
        description: 'Get paginated list of cash transactions. Supports filtering.',
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
          { name: 'type', in: 'query', schema: { type: 'string', enum: ['income', 'expense'] } },
          { name: 'category', in: 'query', schema: { type: 'string' } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
          { name: 'startDate', in: 'query', schema: { type: 'string', format: 'date' } },
          { name: 'endDate', in: 'query', schema: { type: 'string', format: 'date' } },
        ],
        responses: {
          '200': {
            description: 'List of cash transactions',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: {
                      type: 'object',
                      properties: {
                        items: { type: 'array', items: { $ref: '#/components/schemas/CashTransaction' } },
                        pagination: { $ref: '#/components/schemas/PaginationMeta' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Finance - Cash'],
        summary: 'Create cash transaction',
        description: 'Create a new cash transaction. Requires bendahara or superadmin role.',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateCashRequest' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Transaction created',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: { $ref: '#/components/schemas/CashTransaction' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/finance/cash/{id}': {
      get: {
        tags: ['Finance - Cash'],
        summary: 'Get cash transaction by ID',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
        ],
        responses: {
          '200': {
            description: 'Cash transaction details',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: { $ref: '#/components/schemas/CashTransaction' },
                  },
                },
              },
            },
          },
          '404': {
            description: 'Transaction not found',
          },
        },
      },
      put: {
        tags: ['Finance - Cash'],
        summary: 'Update cash transaction',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateCashRequest' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Transaction updated',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: { $ref: '#/components/schemas/CashTransaction' },
                  },
                },
              },
            },
          },
        },
      },
      delete: {
        tags: ['Finance - Cash'],
        summary: 'Delete cash transaction',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
        ],
        responses: {
          '200': {
            description: 'Transaction deleted',
          },
        },
      },
    },

    // ========================
    // FINANCE ZIS PATHS
    // ========================
    '/finance/zis': {
      get: {
        tags: ['Finance - ZIS'],
        summary: 'List ZIS transactions',
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
          { name: 'type', in: 'query', schema: { type: 'string', enum: ['income', 'expense'] } },
          { name: 'zisCategory', in: 'query', schema: { type: 'string', enum: ['zakat', 'infaq', 'shadaqah'] } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
          { name: 'startDate', in: 'query', schema: { type: 'string', format: 'date' } },
          { name: 'endDate', in: 'query', schema: { type: 'string', format: 'date' } },
        ],
        responses: {
          '200': {
            description: 'List of ZIS transactions',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: {
                      type: 'object',
                      properties: {
                        items: { type: 'array', items: { $ref: '#/components/schemas/ZisTransaction' } },
                        pagination: { $ref: '#/components/schemas/PaginationMeta' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Finance - ZIS'],
        summary: 'Create ZIS transaction',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateZisRequest' },
            },
          },
        },
        responses: {
          '201': {
            description: 'ZIS transaction created',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: { $ref: '#/components/schemas/ZisTransaction' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/finance/zis/{id}': {
      get: {
        tags: ['Finance - ZIS'],
        summary: 'Get ZIS transaction by ID',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
        ],
        responses: {
          '200': {
            description: 'ZIS transaction details',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: { $ref: '#/components/schemas/ZisTransaction' },
                  },
                },
              },
            },
          },
        },
      },
      put: {
        tags: ['Finance - ZIS'],
        summary: 'Update ZIS transaction',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateZisRequest' },
            },
          },
        },
        responses: {
          '200': {
            description: 'ZIS transaction updated',
          },
        },
      },
      delete: {
        tags: ['Finance - ZIS'],
        summary: 'Delete ZIS transaction',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
        ],
        responses: {
          '200': {
            description: 'ZIS transaction deleted',
          },
        },
      },
    },
    '/finance/summary': {
      get: {
        tags: ['Finance - Summary'],
        summary: 'Get finance summary',
        description: 'Get overall financial summary including cash and ZIS balances.',
        responses: {
          '200': {
            description: 'Finance summary',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: { $ref: '#/components/schemas/FinanceSummary' },
                  },
                },
              },
            },
          },
        },
      },
    },

    // ========================
    // JUMAT SCHEDULES PATHS
    // ========================
    '/jumat-schedules': {
      get: {
        tags: ['Jumat Schedules'],
        summary: 'List all Jumat schedules',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'List of Jumat schedules',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/JumatSchedule' },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Jumat Schedules'],
        summary: 'Create Jumat schedule',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateJumatScheduleRequest' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Schedule created',
          },
        },
      },
    },
    '/jumat-schedules/{id}': {
      get: {
        tags: ['Jumat Schedules'],
        summary: 'Get Jumat schedule by ID',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
        ],
        responses: {
          '200': {
            description: 'Schedule details',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: { $ref: '#/components/schemas/JumatSchedule' },
                  },
                },
              },
            },
          },
        },
      },
      put: {
        tags: ['Jumat Schedules'],
        summary: 'Update Jumat schedule',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateJumatScheduleRequest' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Schedule updated',
          },
        },
      },
    },

    // ========================
    // CONGREGATION PATHS
    // ========================
    '/congregation': {
      get: {
        tags: ['Congregation'],
        summary: 'List all congregations',
        description: 'Get paginated list of congregation members.',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
        ],
        responses: {
          '200': {
            description: 'List of congregations',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/PaginatedResponse' },
              },
            },
          },
        },
      },
      post: {
        tags: ['Congregation'],
        summary: 'Create congregation member',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateCongregationRequest' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Member created',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: { $ref: '#/components/schemas/Congregation' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/congregation/{id}': {
      put: {
        tags: ['Congregation'],
        summary: 'Update congregation member',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateCongregationRequest' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Member updated',
          },
        },
      },
    },
    '/congregation/{id}/deactivate': {
      patch: {
        tags: ['Congregation'],
        summary: 'Deactivate congregation member',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
        ],
        responses: {
          '200': {
            description: 'Member deactivated',
          },
        },
      },
    },
    '/congregation/export': {
      get: {
        tags: ['Congregation'],
        summary: 'Export congregations to Excel',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'format', in: 'query', required: true, schema: { type: 'string', enum: ['excel'] } },
        ],
        responses: {
          '200': {
            description: 'Excel file download',
            content: {
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
                schema: { type: 'string', format: 'binary' },
              },
            },
          },
        },
      },
    },
    '/congregation/import': {
      post: {
        tags: ['Congregation'],
        summary: 'Import congregations from file',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  file: { type: 'string', format: 'binary' },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Import result',
          },
        },
      },
    },

    // ========================
    // INVENTORY PATHS
    // ========================
    '/inventory': {
      get: {
        tags: ['Inventory'],
        summary: 'List inventory items',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
          { name: 'categoryId', in: 'query', schema: { type: 'integer' } },
          { name: 'condition', in: 'query', schema: { type: 'string', enum: ['baik', 'rusak_ringan', 'rusak_berat', 'hilang'] } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
        ],
        responses: {
          '200': {
            description: 'List of inventory items',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/InventoryItem' },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Inventory'],
        summary: 'Create inventory item',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                allOf: [
                  { $ref: '#/components/schemas/CreateInventoryRequest' },
                  {
                    type: 'object',
                    properties: {
                      photo: { type: 'string', format: 'binary' },
                    },
                  },
                ],
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Inventory item created',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: { $ref: '#/components/schemas/InventoryItem' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/inventory/{id}': {
      get: {
        tags: ['Inventory'],
        summary: 'Get inventory item by ID',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
        ],
        responses: {
          '200': {
            description: 'Inventory item details',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: { $ref: '#/components/schemas/InventoryItem' },
                  },
                },
              },
            },
          },
        },
      },
      put: {
        tags: ['Inventory'],
        summary: 'Update inventory item',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
        ],
        requestBody: {
          content: {
            'multipart/form-data': {
              schema: {
                allOf: [
                  { $ref: '#/components/schemas/UpdateInventoryRequest' },
                  {
                    type: 'object',
                    properties: {
                      photo: { type: 'string', format: 'binary' },
                    },
                  },
                ],
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Inventory item updated',
          },
        },
      },
      delete: {
        tags: ['Inventory'],
        summary: 'Delete inventory item',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
        ],
        responses: {
          '200': {
            description: 'Inventory item deleted',
          },
        },
      },
    },

    // ========================
    // INVENTORY CATEGORIES PATHS
    // ========================
    '/inventory-categories': {
      get: {
        tags: ['Inventory Categories'],
        summary: 'List inventory categories',
        responses: {
          '200': {
            description: 'List of categories',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/InventoryCategory' },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Inventory Categories'],
        summary: 'Create inventory category',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateInventoryCategoryRequest' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Category created',
          },
        },
      },
    },
    '/inventory-categories/{id}': {
      put: {
        tags: ['Inventory Categories'],
        summary: 'Update inventory category',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateInventoryCategoryRequest' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Category updated',
          },
        },
      },
      delete: {
        tags: ['Inventory Categories'],
        summary: 'Delete inventory category',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
        ],
        responses: {
          '200': {
            description: 'Category deleted',
          },
        },
      },
    },

    // ========================
    // INVENTORY LOANS PATHS
    // ========================
    '/inventory-loan': {
      get: {
        tags: ['Inventory Loans'],
        summary: 'List inventory loans',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
          { name: 'status', in: 'query', schema: { type: 'string', enum: ['borrowed', 'returned', 'overdue'] } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
        ],
        responses: {
          '200': {
            description: 'List of loans',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: {
                      type: 'object',
                      properties: {
                        items: { type: 'array', items: { $ref: '#/components/schemas/InventoryLoan' } },
                        pagination: { $ref: '#/components/schemas/PaginationMeta' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Inventory Loans'],
        summary: 'Create inventory loan',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateInventoryLoanRequest' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Loan created',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: { $ref: '#/components/schemas/InventoryLoan' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/inventory-loan/{id}': {
      get: {
        tags: ['Inventory Loans'],
        summary: 'Get inventory loan by ID',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
        ],
        responses: {
          '200': {
            description: 'Loan details',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: { $ref: '#/components/schemas/InventoryLoan' },
                  },
                },
              },
            },
          },
        },
      },
      put: {
        tags: ['Inventory Loans'],
        summary: 'Update inventory loan',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateInventoryLoanRequest' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Loan updated',
          },
        },
      },
      delete: {
        tags: ['Inventory Loans'],
        summary: 'Delete inventory loan',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
        ],
        responses: {
          '200': {
            description: 'Loan deleted',
          },
        },
      },
    },
    '/inventory-loan/{id}/return': {
      put: {
        tags: ['Inventory Loans'],
        summary: 'Return inventory loan',
        description: 'Mark a loan as returned and update item condition.',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ReturnInventoryLoanRequest' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Loan returned successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: { $ref: '#/components/schemas/InventoryLoan' },
                  },
                },
              },
            },
          },
        },
      },
    },

    // ========================
    // EVENTS PATHS
    // ========================
    '/events': {
      get: {
        tags: ['Events'],
        summary: 'List all events',
        description: 'Public endpoint to list events with pagination.',
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
          { name: 'status', in: 'query', schema: { type: 'string', enum: ['upcoming', 'ongoing', 'completed', 'cancelled'] } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
        ],
        responses: {
          '200': {
            description: 'List of events',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: {
                      type: 'object',
                      properties: {
                        items: { type: 'array', items: { $ref: '#/components/schemas/Event' } },
                        pagination: { $ref: '#/components/schemas/PaginationMeta' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Events'],
        summary: 'Create event',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                allOf: [
                  { $ref: '#/components/schemas/CreateEventRequest' },
                  {
                    type: 'object',
                    properties: {
                      poster: { type: 'string', format: 'binary' },
                    },
                  },
                ],
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Event created',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: { $ref: '#/components/schemas/Event' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/events/{id}': {
      put: {
        tags: ['Events'],
        summary: 'Update event',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
        ],
        requestBody: {
          content: {
            'multipart/form-data': {
              schema: {
                allOf: [
                  { $ref: '#/components/schemas/CreateEventRequest' },
                  {
                    type: 'object',
                    properties: {
                      poster: { type: 'string', format: 'binary' },
                    },
                  },
                ],
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Event updated',
          },
        },
      },
      patch: {
        tags: ['Events'],
        summary: 'Update event status',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateEventStatusRequest' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Event status updated',
          },
        },
      },
      delete: {
        tags: ['Events'],
        summary: 'Delete event',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
        ],
        responses: {
          '200': {
            description: 'Event deleted',
          },
        },
      },
    },

    // ========================
    // ARTICLES PATHS
    // ========================
    '/articles': {
      get: {
        tags: ['Articles'],
        summary: 'List all articles',
        description: 'Public endpoint to list published articles.',
        parameters: [
          { name: 'category', in: 'query', schema: { type: 'string' } },
        ],
        responses: {
          '200': {
            description: 'List of articles',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: { type: 'array', items: { $ref: '#/components/schemas/Article' } },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Articles'],
        summary: 'Create article',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateArticleRequest' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Article created',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: { $ref: '#/components/schemas/Article' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/articles/{id}': {
      put: {
        tags: ['Articles'],
        summary: 'Update article',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateArticleRequest' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Article updated',
          },
        },
      },
      delete: {
        tags: ['Articles'],
        summary: 'Delete article',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
        ],
        responses: {
          '200': {
            description: 'Article deleted',
          },
        },
      },
    },
    '/articles/{id}/publish': {
      patch: {
        tags: ['Articles'],
        summary: 'Publish article',
        description: 'Toggle article publish status.',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
        ],
        responses: {
          '200': {
            description: 'Article publish status updated',
          },
        },
      },
    },

    // ========================
    // ARTICLE CATEGORIES PATHS
    // ========================
    '/article-categories': {
      get: {
        tags: ['Article Categories'],
        summary: 'List article categories',
        responses: {
          '200': {
            description: 'List of categories',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: { type: 'array', items: { $ref: '#/components/schemas/ArticleCategory' } },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Article Categories'],
        summary: 'Create article category',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateArticleCategoryRequest' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Category created',
          },
        },
      },
    },
    '/article-categories/{id}': {
      put: {
        tags: ['Article Categories'],
        summary: 'Update article category',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateArticleCategoryRequest' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Category updated',
          },
        },
      },
      delete: {
        tags: ['Article Categories'],
        summary: 'Delete article category',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
        ],
        responses: {
          '200': {
            description: 'Category deleted',
          },
        },
      },
    },

    // ========================
    // DONATIONS PATHS
    // ========================
    '/donations': {
      get: {
        tags: ['Donations'],
        summary: 'List donations',
        description: 'Admin endpoint to list all donations with filtering.',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
          { name: 'status', in: 'query', schema: { type: 'string', enum: ['pending', 'verified', 'rejected'] } },
          { name: 'categoryId', in: 'query', schema: { type: 'integer' } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
        ],
        responses: {
          '200': {
            description: 'List of donations',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: {
                      type: 'object',
                      properties: {
                        items: { type: 'array', items: { $ref: '#/components/schemas/Donation' } },
                        pagination: { $ref: '#/components/schemas/PaginationMeta' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Donations'],
        summary: 'Submit donation',
        description: 'Public endpoint to submit a new donation with optional proof of payment.',
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                allOf: [
                  { $ref: '#/components/schemas/SubmitDonationRequest' },
                  {
                    type: 'object',
                    properties: {
                      proof: { type: 'string', format: 'binary', description: 'Proof of payment image' },
                    },
                  },
                ],
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Donation submitted',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: { $ref: '#/components/schemas/Donation' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/donations/stats': {
      get: {
        tags: ['Donations'],
        summary: 'Get donation statistics',
        description: 'Public endpoint to get aggregated donation statistics.',
        responses: {
          '200': {
            description: 'Donation stats',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: { $ref: '#/components/schemas/DonationStats' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/donations/{id}/certificate': {
      get: {
        tags: ['Donations'],
        summary: 'Get donation certificate',
        description: 'Download donation certificate as PDF.',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
        ],
        responses: {
          '200': {
            description: 'PDF certificate download',
            content: {
              'application/pdf': {
                schema: { type: 'string', format: 'binary' },
              },
            },
          },
        },
      },
    },
    '/donations/{id}/verify': {
      put: {
        tags: ['Donations'],
        summary: 'Verify donation',
        description: 'Mark a donation as verified.',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
        ],
        responses: {
          '200': {
            description: 'Donation verified',
          },
        },
      },
    },
    '/donations/{id}/reject': {
      put: {
        tags: ['Donations'],
        summary: 'Reject donation',
        description: 'Reject a donation with a reason note.',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RejectDonationRequest' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Donation rejected',
          },
        },
      },
    },

    // ========================
    // MUSTAHIK PATHS
    // ========================
    '/mustahik': {
      get: {
        tags: ['Mustahik'],
        summary: 'List mustahik',
        description: 'Public endpoint to list mustahik/beneficiaries.',
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
          { name: 'category', in: 'query', schema: { type: 'string', enum: ['fakir', 'miskin', 'amil', 'muallaf', 'riqab', 'gharim', 'fisabilillah', 'ibnu_sabil'] } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
        ],
        responses: {
          '200': {
            description: 'List of mustahik',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: {
                      type: 'object',
                      properties: {
                        items: { type: 'array', items: { $ref: '#/components/schemas/Mustahik' } },
                        pagination: { $ref: '#/components/schemas/PaginationMeta' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Mustahik'],
        summary: 'Create mustahik',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateMustahikRequest' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Mustahik created',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: { $ref: '#/components/schemas/Mustahik' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/mustahik/{id}': {
      put: {
        tags: ['Mustahik'],
        summary: 'Update mustahik',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateMustahikRequest' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Mustahik updated',
          },
        },
      },
    },

    // ========================
    // MUSTAHIK DISTRIBUTION PATHS
    // ========================
    '/mustahik-distribution': {
      get: {
        tags: ['Mustahik Distribution'],
        summary: 'Get distribution history',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
        ],
        responses: {
          '200': {
            description: 'Distribution history',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/MustahikDistribution' },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Mustahik Distribution'],
        summary: 'Create distribution',
        description: 'Record a ZIS distribution to a mustahik.',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateDistributionRequest' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Distribution recorded',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: { $ref: '#/components/schemas/MustahikDistribution' },
                  },
                },
              },
            },
          },
        },
      },
    },

    // ========================
    // PRAYER PATHS
    // ========================
    '/prayer': {
      get: {
        tags: ['Prayer'],
        summary: 'Get prayer schedule',
        description: 'Public endpoint to get daily prayer schedule.',
        parameters: [
          { name: 'date', in: 'query', schema: { type: 'string', format: 'date' } },
          { name: 'city', in: 'query', schema: { type: 'string', example: 'Jakarta' } },
        ],
        responses: {
          '200': {
            description: 'Prayer schedule',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/PrayerSchedule' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/prayer/weekly': {
      get: {
        tags: ['Prayer'],
        summary: 'Get weekly prayer schedule',
        description: 'Public endpoint to get weekly prayer times.',
        parameters: [
          { name: 'city', in: 'query', schema: { type: 'string', example: 'Jakarta' } },
        ],
        responses: {
          '200': {
            description: 'Weekly prayer schedule',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/PrayerSchedule' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/prayer/sync': {
      post: {
        tags: ['Prayer'],
        summary: 'Sync prayer times',
        description: 'Sync monthly prayer times from external API.',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Prayer times synced',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    result: { type: 'string', example: 'Prayer times synced for January 2024' },
                  },
                },
              },
            },
          },
        },
      },
    },

    // ========================
    // MOSQUE PROFILE PATHS
    // ========================
    '/mosque-profile': {
      get: {
        tags: ['Mosque Profile'],
        summary: 'Get mosque profile',
        description: 'Public endpoint to get mosque profile information.',
        responses: {
          '200': {
            description: 'Mosque profile',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/MosqueProfile' },
                  },
                },
              },
            },
          },
        },
      },
      put: {
        tags: ['Mosque Profile'],
        summary: 'Update mosque profile',
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  address: { type: 'string' },
                  city: { type: 'string' },
                  phone: { type: 'string' },
                  email: { type: 'string', format: 'email' },
                  description: { type: 'string' },
                  bankName: { type: 'string' },
                  bankAccount: { type: 'string' },
                  bankAccountName: { type: 'string' },
                  qris: { type: 'string', format: 'binary', description: 'QRIS image' },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Profile updated',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/MosqueProfile' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/mosque-profile/public-config': {
      get: {
        tags: ['Mosque Profile'],
        summary: 'Get public config',
        description: 'Get public configuration for donation display (bank info, QRIS).',
        responses: {
          '200': {
            description: 'Public configuration',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/PublicConfig' },
                  },
                },
              },
            },
          },
        },
      },
    },

    // ========================
    // CAMPAIGNS PATHS
    // ========================
    '/campaigns': {
      get: {
        tags: ['Campaigns'],
        summary: 'List campaigns',
        description: 'Public endpoint to list all campaigns.',
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
          { name: 'status', in: 'query', schema: { type: 'string', enum: ['active', 'completed', 'cancelled', 'draft'] } },
        ],
        responses: {
          '200': {
            description: 'List of campaigns',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { type: 'array', items: { $ref: '#/components/schemas/Campaign' } },
                    pagination: { $ref: '#/components/schemas/PaginationMeta' },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Campaigns'],
        summary: 'Create campaign',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateCampaignRequest' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Campaign created',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/Campaign' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/campaigns/{id}': {
      get: {
        tags: ['Campaigns'],
        summary: 'Get campaign by ID',
        description: 'Public endpoint to get campaign details.',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
        ],
        responses: {
          '200': {
            description: 'Campaign details',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/Campaign' },
                  },
                },
              },
            },
          },
          '404': {
            description: 'Campaign not found',
          },
        },
      },
      put: {
        tags: ['Campaigns'],
        summary: 'Update campaign',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateCampaignRequest' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Campaign updated',
          },
        },
      },
      delete: {
        tags: ['Campaigns'],
        summary: 'Delete campaign',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
        ],
        responses: {
          '200': {
            description: 'Campaign deleted',
          },
        },
      },
    },
    '/campaigns/{id}/progress': {
      get: {
        tags: ['Campaigns'],
        summary: 'Get campaign progress',
        description: 'Public endpoint to get campaign fundraising progress.',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
        ],
        responses: {
          '200': {
            description: 'Campaign progress',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/CampaignProgress' },
                  },
                },
              },
            },
          },
        },
      },
    },

    // ========================
    // DASHBOARD PATHS
    // ========================
    '/dashboard/stats': {
      get: {
        tags: ['Dashboard'],
        summary: 'Get dashboard statistics',
        description: 'Get aggregated statistics for the dashboard overview.',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Dashboard stats',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/DashboardStats' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/dashboard/charts/finance': {
      get: {
        tags: ['Dashboard'],
        summary: 'Get finance chart data',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'range', in: 'query', schema: { type: 'string', enum: ['1month', '3months', '6months', '1year'], default: '6months' } },
        ],
        responses: {
          '200': {
            description: 'Finance chart data',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/ChartData' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/dashboard/charts/donations': {
      get: {
        tags: ['Dashboard'],
        summary: 'Get donation chart data',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'range', in: 'query', schema: { type: 'string', enum: ['1month', '3months', '6months', '1year'], default: '6months' } },
        ],
        responses: {
          '200': {
            description: 'Donation chart data',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/ChartData' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/dashboard/charts/zis': {
      get: {
        tags: ['Dashboard'],
        summary: 'Get ZIS chart data',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'range', in: 'query', schema: { type: 'string', enum: ['1month', '3months', '6months', '1year'], default: '6months' } },
        ],
        responses: {
          '200': {
            description: 'ZIS chart data',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/ChartData' },
                  },
                },
              },
            },
          },
        },
      },
    },

    // ========================
    // AUDIT PATHS
    // ========================
    '/audit': {
      get: {
        tags: ['Audit'],
        summary: 'Get audit logs',
        description: 'Get all audit log entries. Superadmin only.',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
        ],
        responses: {
          '200': {
            description: 'Audit logs',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: {
                      type: 'object',
                      properties: {
                        items: { type: 'array', items: { $ref: '#/components/schemas/AuditLog' } },
                        pagination: { $ref: '#/components/schemas/PaginationMeta' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },

    // ========================
    // NOTIFICATIONS PATHS
    // ========================
    '/notifications': {
      get: {
        tags: ['Notifications'],
        summary: 'List notifications',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
          { name: 'isRead', in: 'query', schema: { type: 'boolean' } },
          { name: 'type', in: 'query', schema: { type: 'string', enum: ['donation', 'event', 'inventory', 'campaign', 'system', 'warning'] } },
        ],
        responses: {
          '200': {
            description: 'List of notifications',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { type: 'array', items: { $ref: '#/components/schemas/Notification' } },
                    pagination: { $ref: '#/components/schemas/PaginationMeta' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/notifications/stream': {
      get: {
        tags: ['Notifications'],
        summary: 'Stream notifications (SSE)',
        description: 'Server-Sent Events endpoint for real-time notifications.',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'SSE stream',
            content: {
              'text/event-stream': {
                schema: {
                  type: 'string',
                  example: 'data: {"type":"connected"}\n\n',
                },
              },
            },
          },
        },
      },
    },
    '/notifications/read-all': {
      patch: {
        tags: ['Notifications'],
        summary: 'Mark all notifications as read',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'All notifications marked as read',
          },
        },
      },
    },
    '/notifications/{id}/read': {
      patch: {
        tags: ['Notifications'],
        summary: 'Mark notification as read',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
        ],
        responses: {
          '200': {
            description: 'Notification marked as read',
          },
        },
      },
    },
    '/notifications/{id}': {
      delete: {
        tags: ['Notifications'],
        summary: 'Delete notification',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
        ],
        responses: {
          '200': {
            description: 'Notification deleted',
          },
        },
      },
    },

    // ========================
    // ATTENDANCE PATHS
    // ========================
    '/attendance': {
      get: {
        tags: ['Attendance'],
        summary: 'List attendance sessions',
        description: 'Public endpoint to list attendance sessions.',
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
        ],
        responses: {
          '200': {
            description: 'List of sessions',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: {
                      type: 'object',
                      properties: {
                        items: { type: 'array', items: { $ref: '#/components/schemas/AttendanceSession' } },
                        pagination: { $ref: '#/components/schemas/PaginationMeta' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Attendance'],
        summary: 'Create attendance session',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateAttendanceSessionRequest' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Session created',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: { $ref: '#/components/schemas/AttendanceSession' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/attendance/{id}': {
      get: {
        tags: ['Attendance'],
        summary: 'Get attendance session by ID',
        description: 'Public endpoint.',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
        ],
        responses: {
          '200': {
            description: 'Session details',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: { $ref: '#/components/schemas/AttendanceSession' },
                  },
                },
              },
            },
          },
        },
      },
      put: {
        tags: ['Attendance'],
        summary: 'Update attendance session',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateAttendanceSessionRequest' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Session updated',
          },
        },
      },
      delete: {
        tags: ['Attendance'],
        summary: 'Delete attendance session',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
        ],
        responses: {
          '200': {
            description: 'Session deleted',
          },
        },
      },
    },
    '/attendance/checkin': {
      post: {
        tags: ['Attendance'],
        summary: 'Check in to session',
        description: 'Public endpoint to check in using QR code or manual method.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CheckInRequest' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Check-in successful',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: { type: 'object' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/attendance/report': {
      get: {
        tags: ['Attendance'],
        summary: 'Get attendance report',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'sessionId', in: 'query', schema: { type: 'integer' } },
          { name: 'startDate', in: 'query', schema: { type: 'string', format: 'date' } },
          { name: 'endDate', in: 'query', schema: { type: 'string', format: 'date' } },
        ],
        responses: {
          '200': {
            description: 'Attendance report',
          },
        },
      },
    },

    // ========================
    // PAYMENTS PATHS
    // ========================
    '/payments/create-transaction': {
      post: {
        tags: ['Payments'],
        summary: 'Create payment transaction',
        description: 'Create a new Midtrans payment transaction.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreatePaymentRequest' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Transaction created',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: { $ref: '#/components/schemas/PaymentTransaction' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/payments/{orderId}/status': {
      get: {
        tags: ['Payments'],
        summary: 'Get payment status',
        parameters: [
          { name: 'orderId', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          '200': {
            description: 'Transaction status',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: { $ref: '#/components/schemas/PaymentTransaction' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/payments/{orderId}/refund': {
      post: {
        tags: ['Payments'],
        summary: 'Refund payment',
        description: 'Refund a payment transaction. Superadmin only.',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'orderId', in: 'path', required: true, schema: { type: 'string' } },
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RefundRequest' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Refund processed',
          },
        },
      },
    },
    '/payments/notification': {
      post: {
        tags: ['Payments'],
        summary: 'Midtrans webhook',
        description: 'Midtrans payment notification webhook endpoint.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                description: 'Midtrans notification payload',
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Notification received',
          },
        },
      },
    },

    // ========================
    // REPORTS PATHS
    // ========================
    '/reports/finance/monthly': {
      get: {
        tags: ['Reports'],
        summary: 'Monthly finance report',
        description: 'Get monthly finance report data.',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'month', in: 'query', schema: { type: 'string', example: '2024-01' } },
        ],
        responses: {
          '200': {
            description: 'Monthly finance report',
          },
        },
      },
    },
    '/reports/finance/weekly': {
      get: {
        tags: ['Reports'],
        summary: 'Weekly finance report (Excel)',
        description: 'Download weekly finance report as Excel file.',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'startDate', in: 'query', schema: { type: 'string', format: 'date' } },
          { name: 'endDate', in: 'query', schema: { type: 'string', format: 'date' } },
        ],
        responses: {
          '200': {
            description: 'Excel file download',
            content: { 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': { schema: { type: 'string', format: 'binary' } } },
          },
        },
      },
    },
    '/reports/zis/monthly': {
      get: {
        tags: ['Reports'],
        summary: 'Monthly ZIS report',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'month', in: 'query', schema: { type: 'string', example: '2024-01' } },
        ],
        responses: {
          '200': {
            description: 'Monthly ZIS report',
          },
        },
      },
    },
    '/reports/inventory': {
      get: {
        tags: ['Reports'],
        summary: 'Inventory report (Excel)',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Excel file download',
            content: { 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': { schema: { type: 'string', format: 'binary' } } },
          },
        },
      },
    },
    '/reports/inventory/full': {
      get: {
        tags: ['Reports'],
        summary: 'Full inventory report',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Full inventory data',
          },
        },
      },
    },
    '/reports/donations': {
      get: {
        tags: ['Reports'],
        summary: 'Donations report (Excel)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'startDate', in: 'query', schema: { type: 'string', format: 'date' } },
          { name: 'endDate', in: 'query', schema: { type: 'string', format: 'date' } },
        ],
        responses: {
          '200': {
            description: 'Excel file download',
            content: { 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': { schema: { type: 'string', format: 'binary' } } },
          },
        },
      },
    },
    '/reports/congregations': {
      get: {
        tags: ['Reports'],
        summary: 'Congregation report',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Congregation report data',
          },
        },
      },
    },
    '/reports/annual': {
      get: {
        tags: ['Reports'],
        summary: 'Annual report',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'year', in: 'query', schema: { type: 'integer', example: 2024 } },
        ],
        responses: {
          '200': {
            description: 'Annual report data',
          },
        },
      },
    },

    // ========================
    // GALLERY PATHS
    // ========================
    '/gallery': {
      get: {
        tags: ['Gallery'],
        summary: 'List gallery images',
        description: 'Public endpoint to get all gallery images.',
        responses: {
          '200': {
            description: 'List of images',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: { type: 'array', items: { $ref: '#/components/schemas/GalleryImage' } },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Gallery'],
        summary: 'Upload gallery images',
        description: 'Upload up to 10 images to the gallery.',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  images: {
                    type: 'array',
                    items: { type: 'string', format: 'binary' },
                    description: 'Image files (max 10)',
                  },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Images uploaded',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: { type: 'array', items: { $ref: '#/components/schemas/GalleryImage' } },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/gallery/{id}': {
      delete: {
        tags: ['Gallery'],
        summary: 'Delete gallery image',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
        ],
        responses: {
          '200': {
            description: 'Image deleted',
          },
        },
      },
    },

    // ========================
    // BACKUP PATHS
    // ========================
    '/backup/backup': {
      post: {
        tags: ['Backup'],
        summary: 'Create backup',
        description: 'Create a new database backup. Superadmin only. Rate limited.',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Backup created',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/BackupInfo' },
                  },
                },
              },
            },
          },
        },
      },
      get: {
        tags: ['Backup'],
        summary: 'List backups',
        description: 'List all available database backups. Superadmin only.',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'List of backups',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { type: 'array', items: { $ref: '#/components/schemas/BackupInfo' } },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/backup/backup/{fileName}': {
      delete: {
        tags: ['Backup'],
        summary: 'Delete backup',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'fileName', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          '200': {
            description: 'Backup deleted',
          },
        },
      },
    },
    '/backup/restore/validate': {
      post: {
        tags: ['Backup'],
        summary: 'Validate restore file',
        description: 'Upload and validate a backup file for restoration. Superadmin only.',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  file: { type: 'string', format: 'binary', description: 'Backup file (.sql.gz)' },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Validation result',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/RestoreValidation' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/backup/restore': {
      post: {
        tags: ['Backup'],
        summary: 'Restore database',
        description: 'Restore database from a previously validated backup. Superadmin only.',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ConfirmRestoreRequest' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Database restored',
          },
        },
      },
    },

    // ========================
    // HEALTH PATHS
    // ========================
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Basic health check',
        description: 'Simple health check endpoint (public).',
        responses: {
          '200': {
            description: 'System is healthy',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/BasicHealth' },
              },
            },
          },
          '503': {
            description: 'System is unhealthy',
          },
        },
      },
    },
    '/health/detailed': {
      get: {
        tags: ['Health'],
        summary: 'Detailed health check',
        description: 'Detailed health information including DB, Redis, memory, disk. Superadmin only.',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Detailed health status',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/DetailedHealth' },
              },
            },
          },
        },
      },
    },
  },
};

export const swaggerSpec = swaggerJsdoc({
  definition: swaggerDefinition,
  apis: [], // no file-based annotations needed, all definitions inline
});