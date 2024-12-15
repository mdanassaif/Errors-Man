import { Code, Users, Brain, BookOpen, Shield } from "lucide-react";

export const FEATURES = [
  {
    icon: Users,
    title: "Global Developer Network",
    description:
      "Connect with passionate developers worldwide, share insights, and build meaningful professional relationships.",
    color: "text-blue-600",
    background: "bg-blue-50",
    detailImage: "/image1.png",
  },
  {
    icon: Code,
    title: "Collaborative Problem Solving",
    description:
      "Engage in real-time code debugging, pair programming, and interactive troubleshooting across diverse technologies.",
    color: "text-green-600",
    background: "bg-green-50",
    detailImage: "/image2.png",
  },
  {
    icon: Brain,
    title: "AI-Powered Development Support",
    description:
      "Leverage cutting-edge AI to get instant error resolution, intelligent code suggestions, and learning recommendations.",
    color: "text-purple-600",
    background: "bg-purple-50",
    detailImage: "/image3.png",
  },
  {
    icon: BookOpen,
    title: "Continuous Learning Ecosystem",
    description:
      "Access comprehensive tutorials, coding challenges, skill assessment tools, and personalized learning paths.",
    color: "text-orange-600",
    background: "bg-orange-50",
    detailImage: "/image4.png",
  },
  {
    icon: Shield,
    title: "Secure & Ethical Community",
    description:
      "Maintain a safe, respectful platform with robust privacy controls, code of conduct, and inclusive collaboration.",
    color: "text-red-600",
    background: "bg-red-50",
    detailImage: "/image5.png",
  },
];

export const INITIAL_FORM_DATA = {
  username: "",
  password: "",
  about: "",
};
