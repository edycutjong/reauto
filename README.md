<div align="center">
  <h1>Reauto 🚀</h1>
  <p><em>AI-narrated cross-chain exploit forensics powered by GoldRush.</em></p>
  <img src="docs/readme-hero.png" alt="Reauto Hero" width="100%">
  
  <br/>
  
  [![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen.svg)](https://reauto.edycu.dev)
  [![Pitch Deck](https://img.shields.io/badge/Pitch-Deck-f59e0b.svg)](https://reauto.edycu.dev/pitch)
  [![Pitch Video](https://img.shields.io/badge/Pitch-Video-red.svg)](https://youtube.com/your-video)
  [![Superteam Earn](https://img.shields.io/badge/Superteam-Earn_Listing-blue.svg)](https://superteam.fun/earn/listing/build-with-goldrush-track-powered-by-covalent)

  <br/>

  ![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white)
  ![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
  ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)
  ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
  ![GoldRush](https://img.shields.io/badge/GoldRush-F3BA2F?style=flat&logo=binance&logoColor=white)
  ![Vitest](https://img.shields.io/badge/Vitest-FCC72B?style=flat&logo=vitest&logoColor=white)
</div>

---

## 📸 See it in Action
*(Demo GIF and UI screenshots can be found in the `docs` directory)*

[**▶️ Watch the Demo Video**](https://youtube.com/your-demo-link)

<div align="center">
  <img src="docs/og-image.png" alt="App Demo" width="100%">
</div>

## 💡 The Problem & Solution
Analyzing cross-chain exploits is traditionally a slow, manual process requiring deep expertise. Incident responders waste hours piecing together fragmented on-chain data to understand an attack.

**Reauto** solves this by providing: 
AI-narrated cross-chain exploit forensics powered by GoldRush.

**Key Features:**
- ⚡ **High Performance:** Seamless integration and optimized workflows.
- 🔒 **Secure by Design:** Verifiable on-chain actions and robust data protection.
- 🎨 **Intuitive UX:** Beautiful, user-centric interface built for scale.

## 🏗️ Architecture & Tech Stack

### Tech Stack
| Component | Technology | Description |
|-----------|------------|-------------|
| **Frontend** | Next.js 16, React 19 | App Router, SSR, Server Components |
| **Styling** | Tailwind CSS v4 | High-performance responsive UI |
| **Language** | TypeScript | Strict type safety across the stack |
| **Data Provider**| GoldRush API | Comprehensive multichain transaction & balances data |
| **Testing** | Vitest | Comprehensive unit and component testing |

For a detailed breakdown of our system architecture and data flow, please refer to the [Architecture Document](docs/ARCHITECTURE.md).

## 🧩 How We Use GoldRush

**Reauto** fundamentally relies on GoldRush to function:

1. **GoldRush API:** We use the GoldRush API to fetch granular, multichain transaction data and historical balances surrounding an exploit. This structured data allows our AI engine to accurately reconstruct the sequence of events and generate a human-readable forensic narrative.

## 🏆 Sponsor Tracks Targeted
* **Sponsor Integration**: GoldRush ($7,500 grand prize)
* Check `docs/SPONSOR_DEFENSE.md` for our full sponsor integration strategy.

## 🚀 Run it Locally (For Judges)

1. **Clone the repo:** `git clone https://github.com/edycutjong/reauto.git`
2. **Install dependencies:** `npm install`
3. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   *Note: Add your GoldRush API key to `COVALENT_API_KEY` in the `.env.local` file.*
4. **Run the app:** `npm run dev`

> **Note for Judges:** 
> Sponsor defenses and architecture details are located in the `docs/` directory.
> Read `docs/SPONSOR_DEFENSE.md` for technical implementation details.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
