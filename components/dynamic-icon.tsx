'use client';

import type { LucideProps } from 'lucide-react';
import {
  Globe, Smartphone, Code2, Palette, Boxes, Workflow, Database,
  Lightbulb, Rocket, Brain, Users, Wrench, Layers, ShieldCheck,
  Handshake, TrendingUp, Building2, GraduationCap, HeartPulse,
  ShoppingCart, Landmark, Factory, Briefcase, BriefcaseBusiness,
  Store, Dumbbell, HardHat, Hotel, Construction,
  Monitor, Server, Cloud, Lock, Search, Mail, Phone, MapPin,
  Star, Heart, Zap, Settings, Layout, Grid, List, Image,
  Video, Music, File, Folder, Download, Upload, Link,
  ExternalLink, ArrowRight, ArrowLeft, ChevronRight, ChevronLeft,
  Plus, Minus, Check, X, AlertCircle, Info, HelpCircle,
  Home, Menu, Bell, User, LogIn, LogOut, Eye, EyeOff,
  Edit, Trash2, Copy, Share2, Bookmark, Tag, Clock,
  Calendar, MessageSquare, MessageCircle, Send, Mic,
  Camera, Printer, Scissors, Pen, PenTool, Compass,
  Map, Navigation, Target, Award, Gift, Package,
  ShoppingBag, CreditCard, DollarSign, BarChart2,
  PieChart, LineChart, Activity, Cpu, Wifi, Battery,
  Bluetooth, Radio, Tv, Headphones, Speaker,
  Car, Truck, Plane, Ship, Train, Bus,
  Sun, Moon, CloudRain, Wind, Thermometer,
  Coffee, Pizza, Apple, Leaf, Flower2, TreePine,
  Cat, Dog, Bird, Fish, Bug,
  Shield, Key, Unlock, Hash, AtSign, Percent,
  Stethoscope, Pill, FlaskConical, Microscope,
  GraduationCap as GraduationCapIcon,
  BookOpen, School, LibraryBig,
  Banknote, PiggyBank, Wallet, TrendingDown,
  Hammer, Wrench as WrenchIcon, Cog, HardDrive,
  Wheat, Sprout, TreePalm, Mountain,
  Siren, Scale, FileText, ClipboardList,
  Utensils, ChefHat, ShoppingBasket, Wine,
  Fuel, Gauge, Zap as ZapIcon, SunMedium,
  Tv2, Radio as RadioIcon, Newspaper, Megaphone,
  type LucideIcon,
} from 'lucide-react';

/**
 * ICON MAP — maps Lucide icon names (PascalCase) to their components.
 *
 * HOW TO USE IN ADMIN:
 * Type the exact name from this list into the icon field.
 * Names are PascalCase — e.g. "HeartPulse", "GraduationCap", "HardHat"
 * You can also use emojis — e.g. "🏥", "🎓", "🏗️"
 */
const ICON_MAP: Record<string, LucideIcon> = {
  // Tech & Software
  Globe, Smartphone, Code2, Monitor, Server, Cloud, Database,
  Cpu, Wifi, Battery, Bluetooth, HardDrive, Layers,
  Workflow, Boxes, Brain, Lightbulb, Rocket, Zap,

  // Design & Creative
  Palette, Pen, PenTool, Image, Camera, Video, Music,

  // Business & Finance
  Briefcase, BriefcaseBusiness, TrendingUp, TrendingDown,
  BarChart2, PieChart, LineChart, Activity,
  DollarSign, CreditCard, Banknote, PiggyBank, Wallet,
  ShoppingCart, ShoppingBag, ShoppingBasket, Store,

  // Healthcare & Medical
  HeartPulse, Heart, Stethoscope, Pill, FlaskConical, Microscope,

  // Education
  GraduationCap, BookOpen, School, LibraryBig,

  // Construction & Engineering
  HardHat, Construction, Hammer, Cog, Wrench, Factory,

  // Hospitality & Food
  Hotel, Utensils, ChefHat, Coffee, Pizza, Wine,

  // Legal & Government
  Landmark, Scale, Shield, FileText, ClipboardList,

  // Agriculture & Nature
  Wheat, Sprout, TreePalm, Mountain, Leaf, Flower2, TreePine, Apple,

  // Transport & Logistics
  Car, Truck, Plane, Ship, Train, Bus,

  // Real Estate & Property
  Building2, Home, MapPin, Map, Navigation,

  // Media & Communication
  Tv, Newspaper, Megaphone, Radio, Headphones, Speaker, Mic,
  Mail, Phone, MessageSquare, MessageCircle, Send, Bell,

  // General UI
  Search, Settings, Layout, Grid, List,
  File, Folder, Download, Upload, Link, ExternalLink,
  ArrowRight, ArrowLeft, ChevronRight, ChevronLeft,
  Plus, Minus, Check, X, AlertCircle, Info, HelpCircle,
  Eye, EyeOff, LogIn, LogOut, User, Users, Lock, Key, Unlock,
  Edit, Trash2, Copy, Share2, Bookmark, Tag, Clock, Calendar,
  Target, Award, Gift, Package, Compass,
  Hash, AtSign, Percent, Star, Handshake,

  // Weather
  Sun, Moon, CloudRain, Wind, Thermometer,

  // Energy
  Fuel, Gauge, SunMedium,

  // Misc
  Dumbbell, Cat, Dog, Bird, Fish, Bug, Printer, Scissors,

  // Aliases for common mistakes
  ShieldCheck, // ShieldCheck is also valid
};

interface DynamicIconProps extends LucideProps {
  /** Lucide icon name e.g. "Globe", "HeartPulse", "HardHat", or an emoji e.g. "🌐" */
  name: string;
}

/**
 * Renders a Lucide icon by name string, or falls back to rendering
 * the value as text/emoji if no matching icon is found.
 *
 * IMPORTANT: Icon names must be PascalCase.
 * ✅ Correct: "HeartPulse", "GraduationCap", "HardHat", "BriefcaseBusiness"
 * ❌ Wrong:   "heart-pulse", "graduation-cap", "hard-hat", "briefcase-business"
 */
export function DynamicIcon({ name, className, ...props }: DynamicIconProps) {
  if (!name) return null;

  // Direct lookup
  const Icon = ICON_MAP[name];
  if (Icon) return <Icon className={className} {...props} />;

  // Try converting kebab-case to PascalCase automatically
  // e.g. "hard-hat" → "HardHat", "heart-pulse" → "HeartPulse"
  const pascalName = name
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
  const IconFromKebab = ICON_MAP[pascalName];
  if (IconFromKebab) return <IconFromKebab className={className} {...props} />;

  // Not a known Lucide name — render as emoji or plain text
  return <span className={className} aria-hidden="true">{name}</span>;
}
