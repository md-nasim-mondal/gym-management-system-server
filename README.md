# জিম ম্যানেজমেন্ট সিস্টেম - সার্ভার সাইড

## প্রজেক্ট পরিচিতি

জিম ম্যানেজমেন্ট সিস্টেমের সার্ভার সাইড হল একটি Express.js ভিত্তিক RESTful API যা জিম পরিচালনার জন্য ব্যাকএন্ড সার্ভিস প্রদান করে। এই API ইউজার ম্যানেজমেন্ট, অথেনটিকেশন, ক্লাস শিডিউলিং এবং বুকিং সিস্টেম সহ বিভিন্ন ফিচার সাপোর্ট করে।

## প্রযুক্তি

- **Node.js** - রানটাইম এনভায়রনমেন্ট
- **Express.js 5.1.0** - ওয়েব ফ্রেমওয়ার্ক
- **TypeScript** - প্রোগ্রামিং ল্যাঙ্গুয়েজ
- **MongoDB** - ডাটাবেস
- **Mongoose** - ODM (Object Data Modeling)
- **JWT** - অথেনটিকেশন
- **Passport.js** - অথেনটিকেশন মিডলওয়্যার
- **Zod** - ভ্যালিডেশন

## API এন্ডপয়েন্ট

### অথেনটিকেশন

- `POST /api/v1/auth/register` - নতুন ইউজার রেজিস্ট্রেশন
- `POST /api/v1/auth/login` - ইউজার লগইন
- `POST /api/v1/auth/refresh-token` - রিফ্রেশ টোকেন
- `POST /api/v1/auth/logout` - ইউজার লগআউট

### ইউজার

- `GET /api/v1/users/profile` - ইউজার প্রোফাইল দেখা
- `PUT /api/v1/users/profile` - ইউজার প্রোফাইল আপডেট
- `GET /api/v1/users` - সব ইউজার দেখা (অ্যাডমিন অনলি)
- `GET /api/v1/users/:id` - নির্দিষ্ট ইউজার দেখা
- `PUT /api/v1/users/:id` - নির্দিষ্ট ইউজার আপডেট
- `DELETE /api/v1/users/:id` - নির্দিষ্ট ইউজার ডিলিট

### ক্লাস শিডিউল

- `GET /api/v1/schedules` - সব শিডিউল দেখা
- `POST /api/v1/schedules` - নতুন শিডিউল তৈরি (ট্রেনার/অ্যাডমিন)
- `GET /api/v1/schedules/:id` - নির্দিষ্ট শিডিউল দেখা
- `PUT /api/v1/schedules/:id` - নির্দিষ্ট শিডিউল আপডেট
- `DELETE /api/v1/schedules/:id` - নির্দিষ্ট শিডিউল ডিলিট

### বুকিং

- `GET /api/v1/bookings` - সব বুকিং দেখা
- `POST /api/v1/bookings` - নতুন বুকিং তৈরি
- `GET /api/v1/bookings/:id` - নির্দিষ্ট বুকিং দেখা
- `PUT /api/v1/bookings/:id` - নির্দিষ্ট বুকিং আপডেট
- `DELETE /api/v1/bookings/:id` - নির্দিষ্ট বুকিং ক্যানসেল

### হেলথ চেক

- `GET /api/v1/health` - API হেলথ চেক

## ইনস্টলেশন

```bash
# রিপোজিটরি ক্লোন করুন
git clone https://github.com/your-username/gym-management-system-server.git

# প্রজেক্ট ডিরেক্টরিতে যান
cd gym-management-system-server

# ডিপেন্ডেন্সি ইনস্টল করুন
npm install

# ডেভেলপমেন্ট সার্ভার চালু করুন
npm run dev
```

## এনভায়রনমেন্ট ভেরিয়েবল

`.env` ফাইল তৈরি করুন এবং নিম্নলিখিত ভেরিয়েবলগুলো সেট করুন:

PORT=5000
MONGODB_URI=mongodb://localhost:27017/gym-management
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=12
NODE_ENV=development


## বিল্ড

```bash
# TypeScript কম্পাইল করুন
npm run build

# প্রোডাকশন সার্ভার চালু করুন
npm start
```

## ডেপ্লয়মেন্ট

Railway-তে ডেপ্লয় করার জন্য:

1. Railway-তে একাউন্ট তৈরি করুন
2. নতুন প্রজেক্ট তৈরি করুন
3. GitHub রিপোজিটরি কানেক্ট করুন
4. এনভায়রনমেন্ট ভেরিয়েবল কনফিগার করুন
5. ডেপ্লয় করুন

## প্রজেক্ট স্ট্রাকচার


src/
├── app/
│   ├── config/           # কনফিগারেশন ফাইল
│   ├── errorHelpers/     # এরর হ্যান্ডলিং ইউটিলিটি
│   ├── helpers/          # হেল্পার ফাংশন
│   ├── interfaces/       # টাইপস্ক্রিপ্ট ইন্টারফেস
│   ├── middlewares/      # এক্সপ্রেস মিডলওয়্যার
│   ├── modules/          # ফিচার মডিউল
│   │   ├── auth/         # অথেনটিকেশন মডিউল
│   │   ├── booking/      # বুকিং মডিউল
│   │   ├── health/       # হেলথ চেক মডিউল
│   │   ├── schedule/     # শিডিউল মডিউল
│   │   └── user/         # ইউজার মডিউল
│   ├── routes/           # API রাউট
│   └── utils/            # ইউটিলিটি ফাংশন
├── app.ts                # এক্সপ্রেস অ্যাপ
└── server.ts            # সার্ভার এন্ট্রি পয়েন্ট



## কন্ট্রিবিউশন

1. ফর্ক করুন
2. ফিচার ব্রাঞ্চ তৈরি করুন (`git checkout -b feature/amazing-feature`)
3. কমিট করুন (`git commit -m 'Add some amazing feature'`)
4. পুশ করুন (`git push origin feature/amazing-feature`)
5. পুল রিকোয়েস্ট খুলুন

## লাইসেন্স

MIT