# Second Brain Lite 🧠

A modern Personal Knowledge Management (PKM) system powered by AI. Build your second brain with intelligent note-taking, automatic connections, and beautiful graph visualization.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Next.js](https://img.shields.io/badge/Next.js-16.0-black.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)

## ✨ Features

- 📝 **Smart Note-Taking**: Create text notes and save URLs with automatic metadata extraction
- 🤖 **AI-Powered Analysis**: Automatic summaries, topic extraction, and smart connections (Premium)
- 🔍 **Powerful Search**: Full-text search with Turkish language support and fuzzy matching
- 📊 **Graph Visualization**: Interactive 2D graph showing connections between your notes
- 🎨 **Beautiful UI**: Modern, responsive design with dark/light mode
- 🔐 **Secure**: Built-in authentication and row-level security
- 💎 **Freemium Model**: Free tier (25 notes) and Premium tier (unlimited + AI)

## 🚀 Quick Start

### For Users

1. Visit the [live app](https://your-app.vercel.app)
2. Create an account
3. Start taking notes!

See the [User Guide](./docs/USER_GUIDE.md) for detailed instructions.

### For Developers

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/second-brain-lite.git
cd second-brain-lite

# Install dependencies
npm install

# Set up environment variables
cp env.example .env
# Edit .env with your credentials

# Run development server
npm run dev
```

See the [Development Guide](./docs/DEVELOPMENT.md) for complete setup instructions.

## 📚 Documentation

- **[User Guide](./docs/USER_GUIDE.md)** - How to use the app
- **[API Documentation](./docs/API.md)** - Complete API reference
- **[Development Guide](./docs/DEVELOPMENT.md)** - Set up local development
- **[Deployment Guide](./docs/DEPLOYMENT.md)** - Deploy to production
- **[Architecture Decisions](./docs/ARCHITECTURE.md)** - Technical decisions and rationale
- **[Admin Guide](./docs/ADMIN_GUIDE.md)** - Subscription management
- **[Prisma Best Practices](./docs/PRISMA_BEST_PRACTICES.md)** - Database workflow

## 🏗️ Tech Stack

**Frontend**:
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- react-force-graph-2d

**Backend**:
- Next.js API Routes
- Supabase (Auth + PostgreSQL)
- Prisma ORM
- Google Gemini AI (2.0 Flash)

**Deployment**:
- Vercel (Frontend + API)
- Supabase (Database + Auth)

## 🎯 Use Cases

- **Personal Knowledge Base**: Organize your thoughts, ideas, and learnings
- **Research Notes**: Save articles, papers, and resources with automatic connections
- **Project Planning**: Track ideas and see how they relate
- **Learning Journal**: Document your learning journey with AI-powered insights
- **Content Creation**: Collect inspiration and discover connections

## 🔑 Key Features

### Free Tier
- ✅ 25 notes maximum
- ✅ Full-text search
- ✅ Graph visualization
- ✅ Export/Import
- ✅ Dark/light mode

### Premium Tier ($9.99/month)
- ✅ **Unlimited notes**
- ✅ **AI-powered features**:
  - Automatic summaries
  - Topic extraction
  - Smart connections
  - Connection explanations
- ✅ Priority support

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e

# Run all tests
npm run test:all
```

**Test Coverage**: 88.5% (23/26 tests passing)

## 📦 Project Structure

```
second-brain-lite/
├── src/
│   ├── app/              # Next.js app router
│   │   ├── api/          # API routes
│   │   ├── app/          # Main app page
│   │   └── auth/         # Auth pages
│   ├── components/       # React components
│   ├── contexts/         # React contexts
│   ├── lib/              # Utilities and helpers
│   └── types/            # TypeScript types
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── migrations/       # Database migrations
├── e2e/                  # E2E tests (Playwright)
├── docs/                 # Documentation
└── public/               # Static files
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes
4. Run tests: `npm run test:all`
5. Commit: `git commit -m "feat: add my feature"`
6. Push: `git push origin feature/my-feature`
7. Open a Pull Request

See [Development Guide](./docs/DEVELOPMENT.md) for coding standards.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Supabase](https://supabase.com/) - Backend as a Service
- [Prisma](https://www.prisma.io/) - Database ORM
- [Google Gemini](https://ai.google.dev/) - AI capabilities
- [Vercel](https://vercel.com/) - Deployment platform
- [react-force-graph](https://github.com/vasturiano/react-force-graph) - Graph visualization

## 📧 Contact

- **Issues**: [GitHub Issues](https://github.com/YOUR_USERNAME/second-brain-lite/issues)
- **Discussions**: [GitHub Discussions](https://github.com/YOUR_USERNAME/second-brain-lite/discussions)
- **Email**: support@secondbrainlite.com

## 🗺️ Roadmap

- [x] Core note-taking functionality
- [x] AI-powered analysis
- [x] Graph visualization
- [x] Full-text search
- [x] Freemium model
- [ ] Payment integration (Stripe)
- [ ] Mobile app (React Native)
- [ ] Browser extension (web clipper)
- [ ] Collaborative features
- [ ] API webhooks
- [ ] Advanced analytics

## 📊 Stats

- **Lines of Code**: ~10,000+
- **Test Coverage**: 88.5%
- **Dependencies**: 30+
- **API Endpoints**: 8
- **Database Tables**: 3
- **Documentation Pages**: 7

---

**Built with ❤️ by [Your Name](https://github.com/YOUR_USERNAME)**

⭐ Star this repo if you find it useful!
