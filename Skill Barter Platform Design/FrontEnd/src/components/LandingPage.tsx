import { motion } from "motion/react";
import { GradientButton } from "./GradientButton";
import { GlassCard } from "./GlassCard";
import { Star, Users, Sparkles, TrendingUp, Award, Target, ArrowRight } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  const features = [
    { icon: Users, title: "Connect", description: "Find peers with complementary skills" },
    { icon: Sparkles, title: "Exchange", description: "Trade skills through our barter system" },
    { icon: Award, title: "Grow", description: "Earn points and unlock achievements" }
  ];

  const skills = ["Web Development", "Graphic Design", "Public Speaking", "Data Science", "Photography", "Music Production"];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "CS Student",
      text: "I learned graphic design by teaching Python. Amazing experience!",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop"
    },
    {
      name: "Michael Rodriguez",
      role: "Design Major",
      text: "The point system is genius. I've collaborated on 15+ projects!",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop"
    },
    {
      name: "Emma Thompson",
      role: "Business Student",
      text: "Found my co-founder through skill exchanges. Life-changing platform!",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
        {/* Floating Orbs Background */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 right-20 w-72 h-72 rounded-full bg-gradient-to-r from-[#6C63FF]/20 to-[#4A90E2]/20 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-20 left-20 w-96 h-96 rounded-full bg-gradient-to-r from-[#FFC857]/20 to-[#6C63FF]/20 blur-3xl"
        />

        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            <motion.h1
              className="text-6xl md:text-7xl lg:text-8xl mb-6 bg-gradient-to-r from-[#6C63FF] via-[#4A90E2] to-[#FFC857] bg-clip-text text-transparent"
            >
              Exchange Skills.
              <br />
              Build Futures.
            </motion.h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
            className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto"
          >
            A collaborative skill-exchange network where college students teach, learn, and grow together.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap gap-4 justify-center mb-12"
          >
            <GradientButton onClick={onGetStarted} size="lg">
              Get Started Free <ArrowRight className="ml-2 w-5 h-5" />
            </GradientButton>
            <GradientButton variant="secondary" size="lg">
              Watch Demo
            </GradientButton>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex items-center justify-center gap-8 text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>10,000+ Students</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 fill-[#FFC857] text-[#FFC857]" />
              <span>4.9 Rating</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              <span>500+ Skills</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 bg-gradient-to-b from-transparent to-muted/20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground">Three simple steps to start your skill journey</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <GlassCard key={index} delay={index * 0.2}>
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#6C63FF] to-[#4A90E2] flex items-center justify-center mb-6 mx-auto"
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-center mb-3">{feature.title}</h3>
                <p className="text-center text-muted-foreground">{feature.description}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Carousel */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl text-center mb-12"
          >
            Popular Skills
          </motion.h2>

          <div className="flex flex-wrap gap-4 justify-center">
            {skills.map((skill, index) => (
              <motion.div
                key={skill}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
                whileHover={{ scale: 1.1, y: -5 }}
                className="px-8 py-4 glass-panel rounded-full shadow-lg cursor-pointer"
              >
                <span className="bg-gradient-to-r from-[#6C63FF] to-[#4A90E2] bg-clip-text text-transparent">
                  {skill}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 bg-gradient-to-b from-transparent to-muted/20">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl text-center mb-16"
          >
            What Students Say
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, rotateY: -90 }}
                whileInView={{ opacity: 1, rotateY: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                whileHover={{ rotateY: 5, scale: 1.05 }}
                className="glass-panel rounded-3xl p-8 shadow-lg"
              >
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-[#FFC857] text-[#FFC857]" />
                  ))}
                </div>
                <p className="mb-6 text-muted-foreground italic">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#6C63FF] to-[#4A90E2]" />
                  <div>
                    <p>{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto glass-panel rounded-3xl p-12 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#6C63FF]/10 via-[#4A90E2]/10 to-[#FFC857]/10" />
          <div className="relative z-10">
            <h2 className="text-5xl mb-6">Ready to Start Your Journey?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of students already exchanging skills and building their futures.
            </p>
            <GradientButton onClick={onGetStarted} size="lg">
              Join Now - It's Free <Sparkles className="ml-2 w-5 h-5" />
            </GradientButton>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border">
        <div className="max-w-6xl mx-auto text-center text-muted-foreground">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            © 2025 Skill Barter Platform. Built with ❤️ for students, by students.
          </motion.p>
        </div>
      </footer>
    </div>
  );
}
