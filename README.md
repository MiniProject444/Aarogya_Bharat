# Aarogya Bharat Healthcare Platform

A comprehensive healthcare platform built with React, TypeScript, and Supabase that connects patients with doctors for seamless appointment booking and medical care management.

## Features

### For Patients
- **User Registration & Authentication**: Secure signup and login
- **Doctor Discovery**: Browse and search doctors by specialty or name
- **Appointment Booking**: Schedule appointments with preferred doctors
- **Medical Records**: View appointment history and prescriptions
- **Emergency Services**: Quick access to emergency assistance
- **Profile Management**: Update personal and medical information

### For Doctors
- **Professional Profiles**: Manage qualifications, specialties, and availability
- **Appointment Management**: View and manage patient appointments
- **Patient Records**: Access patient medical history for appointments
- **Prescription Management**: Create and manage digital prescriptions
- **Schedule Management**: Set availability and working hours

### General Features
- **Emergency Services**: 24/7 emergency request system
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Real-time Updates**: Live data synchronization
- **Secure Data**: HIPAA-compliant data handling with Supabase

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Authentication, Real-time)
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Build Tool**: Vite

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd aarogya-bharat
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Copy your project URL and anon key
   - Create a `.env` file based on `.env.example`:
     ```env
     VITE_SUPABASE_URL=your_supabase_project_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

4. **Set up the database**
   - Go to your Supabase dashboard
   - Navigate to SQL Editor
   - Run the migration script from `supabase/migrations/create_initial_schema.sql`

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   - Navigate to `http://localhost:5173`

## Database Schema

The application uses the following main tables:

- **profiles**: User profiles (extends Supabase auth.users)
- **patients**: Patient-specific information
- **doctors**: Doctor-specific information and credentials
- **doctor_availability**: Doctor working hours and availability
- **appointments**: Appointment bookings between patients and doctors
- **prescriptions**: Digital prescriptions with medications and advice
- **emergency_requests**: Emergency assistance requests

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── common/         # Common components (Navbar, Footer)
│   └── emergency/      # Emergency-related components
├── context/            # React Context providers
├── hooks/              # Custom React hooks
├── layouts/            # Page layout components
├── lib/                # Library configurations (Supabase)
├── pages/              # Page components
│   ├── patient/        # Patient-specific pages
│   └── doctor/         # Doctor-specific pages
├── services/           # API service layers
└── data/               # Mock data and constants
```

## Key Features Implementation

### Authentication
- Supabase Auth with email/password
- Role-based access control (Patient/Doctor)
- Protected routes and user sessions

### Real-time Features
- Live appointment updates
- Real-time prescription notifications
- Emergency request tracking

### Security
- Row Level Security (RLS) policies
- Encrypted data transmission
- HIPAA-compliant data handling

## API Services

The application includes service layers for:

- **AuthService**: User authentication and profile management
- **DoctorService**: Doctor profiles and availability management
- **AppointmentService**: Appointment booking and management
- **PrescriptionService**: Digital prescription management
- **EmergencyService**: Emergency request handling

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Environment Variables

Required environment variables:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Netlify/Vercel
1. Connect your repository to your hosting platform
2. Set environment variables in the hosting dashboard
3. Deploy with build command: `npm run build`
4. Set publish directory: `dist`

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Email: support@aarogyabharat.com
- Documentation: [Link to docs]
- Issues: [GitHub Issues](link-to-issues)

---

Built with ❤️ for better healthcare accessibility in India.