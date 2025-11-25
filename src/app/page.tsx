import Link from "next/link";
import { PublicNav } from "@/components/layout";
import { 
  Sparkles, 
  Calendar, 
  Heart, 
  MapPin, 
  ChevronRight,
  Star,
  Users,
  Shield
} from "lucide-react";

// Animal illustrations for hero section
const HeroAnimals = () => (
  <div className="relative w-full h-80 md:h-96">
    {/* Soccer bunny */}
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 md:w-64 md:h-64 animate-bounce" style={{ animationDuration: "3s" }}>
      <svg viewBox="0 0 200 200" className="w-full h-full">
        {/* Body */}
        <ellipse cx="100" cy="140" rx="35" ry="40" fill="#F5F0E8" />
        <ellipse cx="100" cy="135" rx="25" ry="30" fill="#FFFFFF" />
        
        {/* Ears */}
        <rect x="70" y="50" width="18" height="50" rx="9" fill="#F5F0E8" />
        <rect x="112" y="50" width="18" height="50" rx="9" fill="#F5F0E8" />
        <rect x="75" y="55" width="8" height="40" rx="4" fill="#F8C8C8" />
        <rect x="117" y="55" width="8" height="40" rx="4" fill="#F8C8C8" />
        
        {/* Face */}
        <circle cx="90" cy="120" r="5" fill="#2D3B3B" />
        <circle cx="110" cy="120" r="5" fill="#2D3B3B" />
        <ellipse cx="100" cy="132" rx="6" ry="4" fill="#F8C8C8" />
        
        {/* Shirt */}
        <rect x="75" y="155" width="50" height="30" rx="5" fill="#5DBDBA" />
        
        {/* Soccer ball */}
        <circle cx="150" cy="150" r="20" fill="#FFFFFF" stroke="#2D3B3B" strokeWidth="2" />
        <path d="M150 130 L155 145 L170 145 L158 155 L162 170 L150 160 L138 170 L142 155 L130 145 L145 145 Z" fill="#2D3B3B" />
      </svg>
    </div>
    
    {/* Floating elements */}
    <div className="absolute left-10 top-20 text-4xl animate-bounce" style={{ animationDelay: "0.5s" }}>⚽</div>
    <div className="absolute right-10 top-32 text-4xl animate-bounce" style={{ animationDelay: "1s" }}>🎨</div>
    <div className="absolute left-20 bottom-20 text-4xl animate-bounce" style={{ animationDelay: "1.5s" }}>🎵</div>
    <div className="absolute right-20 bottom-32 text-4xl animate-bounce" style={{ animationDelay: "2s" }}>🏃</div>
  </div>
);

const features = [
  {
    icon: Sparkles,
    title: "Endless Variety",
    description: "Access sports, music, arts, dance, and more with a single membership.",
    color: "bg-accent-butter",
  },
  {
    icon: Calendar,
    title: "Flexible Booking",
    description: "Book activities that fit your schedule. No long-term commitments required.",
    color: "bg-accent-mint",
  },
  {
    icon: Heart,
    title: "Discover Interests",
    description: "Let your kids explore and find what they truly love without pressure.",
    color: "bg-accent-coral",
  },
  {
    icon: MapPin,
    title: "Local Partners",
    description: "Connect with quality activity providers in your neighborhood.",
    color: "bg-accent-lavender",
  },
];

const howItWorks = [
  {
    step: 1,
    title: "Create Your Family",
    description: "Sign up and add your children's profiles with their ages and interests.",
    emoji: "👨‍👩‍👧‍👦",
  },
  {
    step: 2,
    title: "Browse & Book",
    description: "Explore activities filtered by your child's age and interests, then book with one click.",
    emoji: "🔍",
  },
  {
    step: 3,
    title: "Try & Enjoy",
    description: "Attend activities and discover new passions. Switch it up anytime!",
    emoji: "🎉",
  },
];

const testimonials = [
  {
    quote: "My daughter tried 6 different activities in 2 months. She finally found her love for gymnastics!",
    author: "Sarah M.",
    role: "Mom of 2",
    avatar: "👩",
  },
  {
    quote: "No more expensive trial packages. KidsPass lets us explore without the commitment anxiety.",
    author: "Marcus T.",
    role: "Dad of 3",
    avatar: "👨",
  },
  {
    quote: "The variety is amazing. Swimming on Monday, piano on Wednesday, soccer on Saturday!",
    author: "Elena K.",
    role: "Mom of 1",
    avatar: "👩‍🦰",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg">
      <PublicNav />

      {/* Hero Section */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-light rounded-full text-sm font-semibold text-kidspass-text">
                <Sparkles className="h-4 w-4" />
                One membership, endless adventures
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-kidspass-text leading-tight">
                Flexible activities for{" "}
                <span className="text-primary">curious kids</span>
              </h1>
              
              <p className="text-lg md:text-xl text-kidspass-text-muted max-w-lg">
                Help your children discover their passions through sports, music, arts, 
                and more — without long-term commitments.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-kidspass-text font-bold text-lg rounded-full hover:bg-primary-hover transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                >
                  Get Started Free
                  <ChevronRight className="h-5 w-5" />
                </Link>
                <Link
                  href="#how-it-works"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-kidspass-text font-bold text-lg rounded-full border-2 border-bg-cream hover:border-primary transition-all duration-200"
                >
                  How It Works
                </Link>
              </div>
              
              <div className="flex items-center gap-6 justify-center md:justify-start pt-4">
                <div className="flex -space-x-3">
                  {["👩", "👨", "👩‍🦰", "👨‍🦱"].map((emoji, i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center text-lg border-2 border-white"
                    >
                      {emoji}
                    </div>
                  ))}
                </div>
                <div className="text-sm text-kidspass-text-muted">
                  <span className="font-bold text-kidspass-text">2,000+</span> happy families
                </div>
              </div>
            </div>
            
            <div className="hidden md:block">
              <HeroAnimals />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-kidspass-text mb-4">
              Why parents love KidsPass
            </h2>
            <p className="text-lg text-kidspass-text-muted max-w-2xl mx-auto">
              We make it easy to give your children the gift of exploration and discovery.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <div
                key={feature.title}
                className="p-6 rounded-[var(--radius-xl)] bg-bg hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fadeIn"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className={`w-14 h-14 ${feature.color} rounded-[var(--radius-lg)] flex items-center justify-center mb-4`}>
                  <feature.icon className="h-7 w-7 text-kidspass-text" />
                </div>
                <h3 className="text-xl font-bold text-kidspass-text mb-2">
                  {feature.title}
                </h3>
                <p className="text-kidspass-text-muted">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 md:py-24 bg-bg">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-kidspass-text mb-4">
              How KidsPass works
            </h2>
            <p className="text-lg text-kidspass-text-muted max-w-2xl mx-auto">
              Getting started takes just a few minutes.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((item, i) => (
              <div
                key={item.step}
                className="relative text-center animate-fadeIn"
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                <div className="w-20 h-20 mx-auto mb-6 bg-primary-light rounded-full flex items-center justify-center text-4xl">
                  {item.emoji}
                </div>
                <div className="absolute top-10 left-1/2 w-full h-0.5 bg-primary-light -z-10 hidden md:block" 
                     style={{ display: i === howItWorks.length - 1 ? "none" : undefined }} />
                <span className="inline-block px-3 py-1 bg-primary text-kidspass-text text-sm font-bold rounded-full mb-4">
                  Step {item.step}
                </span>
                <h3 className="text-xl font-bold text-kidspass-text mb-2">
                  {item.title}
                </h3>
                <p className="text-kidspass-text-muted">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Activity Categories Showcase */}
      <section className="py-16 md:py-24 bg-white overflow-hidden">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-kidspass-text mb-4">
              Activities for every interest
            </h2>
            <p className="text-lg text-kidspass-text-muted max-w-2xl mx-auto">
              From ball sports to ballet, music to martial arts — we've got it all.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { emoji: "⚽", label: "Soccer", color: "bg-sports" },
              { emoji: "🎹", label: "Piano", color: "bg-music" },
              { emoji: "🎨", label: "Art Class", color: "bg-arts" },
              { emoji: "🏕️", label: "Outdoor", color: "bg-outdoor" },
              { emoji: "💃", label: "Dance", color: "bg-dance" },
              { emoji: "🏊", label: "Swimming", color: "bg-swimming" },
              { emoji: "🥋", label: "Martial Arts", color: "bg-martial-arts" },
              { emoji: "🎭", label: "Drama", color: "bg-creative" },
              { emoji: "🏀", label: "Basketball", color: "bg-sports" },
              { emoji: "🎸", label: "Guitar", color: "bg-music" },
              { emoji: "🧗", label: "Climbing", color: "bg-outdoor" },
              { emoji: "🎪", label: "Circus", color: "bg-creative" },
            ].map((activity, i) => (
              <div
                key={activity.label}
                className={`${activity.color} px-5 py-3 rounded-full flex items-center gap-2 text-kidspass-text font-semibold hover:scale-105 transition-transform duration-200 cursor-default animate-fadeIn`}
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <span className="text-xl">{activity.emoji}</span>
                <span>{activity.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24 bg-bg">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-kidspass-text mb-4">
              Loved by families
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <div
                key={testimonial.author}
                className="bg-white p-6 rounded-[var(--radius-xl)] shadow-sm hover:shadow-md transition-shadow duration-200 animate-fadeIn"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="h-5 w-5 text-primary fill-primary"
                    />
                  ))}
                </div>
                <p className="text-kidspass-text mb-4 italic">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center text-lg">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-kidspass-text">
                      {testimonial.author}
                    </p>
                    <p className="text-sm text-kidspass-text-muted">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 bg-white border-y border-bg-cream">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            <div className="flex items-center gap-2 text-kidspass-text-muted">
              <Shield className="h-6 w-6" />
              <span className="font-semibold">Verified Partners</span>
            </div>
            <div className="flex items-center gap-2 text-kidspass-text-muted">
              <Users className="h-6 w-6" />
              <span className="font-semibold">2,000+ Families</span>
            </div>
            <div className="flex items-center gap-2 text-kidspass-text-muted">
              <Star className="h-6 w-6" />
              <span className="font-semibold">4.9 Rating</span>
            </div>
            <div className="flex items-center gap-2 text-kidspass-text-muted">
              <Calendar className="h-6 w-6" />
              <span className="font-semibold">50,000+ Bookings</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-kidspass-text mb-4">
            Ready to start exploring?
          </h2>
          <p className="text-lg text-kidspass-text/80 mb-8 max-w-2xl mx-auto">
            Join thousands of families discovering new activities every week. 
            Your first month is free!
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-kidspass-text text-white font-bold text-lg rounded-full hover:bg-kidspass-text/90 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            Start Your Free Trial
            <ChevronRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-kidspass-text">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-3xl">🎨</span>
                <span className="text-2xl font-bold text-white">KidsPass</span>
              </div>
              <p className="text-white/60 text-sm">
                Flexible activities for curious kids. One membership, endless options.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-white/60 text-sm">
                <li><Link href="#" className="hover:text-white transition-colors">How It Works</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Activities</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Partners</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-white/60 text-sm">
                <li><Link href="#" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-white/60 text-sm">
                <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/10 text-center text-white/40 text-sm">
            © {new Date().getFullYear()} KidsPass. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
