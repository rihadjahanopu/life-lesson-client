"use client";

import LessonCard from "@/components/LessonCard";
import { GridSkeleton } from "@/components/Skeleton";
import { lessonService } from "@/services";
import { AnimatePresence, motion } from "framer-motion";
import {
	ArrowRight,
	ArrowUpRight,
	Bookmark,
	BookOpen,
	Brain,
	Briefcase,
	CheckCircle2,
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	Compass,
	Crown,
	Edit2,
	Heart,
	Quote,
	Shield,
	Smile,
	Sparkles,
	TrendingUp,
	Users,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const heroCarouselCards = [
	{
		title: "The Power of Patience in a Restless World",
		category: "Personal Growth",
		tone: "Reflective",
		author: "Sarah Mitchell",
		image:
			"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
		gradient: "from-violet-600 via-indigo-600 to-blue-600",
	},
	{
		title: "Embracing Failure as Your Greatest Teacher",
		category: "Career Growth",
		tone: "Inspiring",
		author: "James Rivera",
		image:
			"https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&h=400&fit=crop",
		gradient: "from-pink-600 via-purple-600 to-rose-600",
	},
	{
		title: "Small Acts of Kindness, Massive Ripples",
		category: "Relationships",
		tone: "Heartwarming",
		author: "Anika Patel",
		image:
			"https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=400&fit=crop",
		gradient: "from-emerald-600 via-teal-600 to-cyan-600",
	},
	{
		title: "Finding Quiet Balance in Daily Noise",
		category: "Wellness",
		tone: "Calming",
		author: "David Chen",
		image:
			"https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=600&h=400&fit=crop",
		gradient: "from-amber-500 via-orange-600 to-red-600",
	},
	{
		title: "The Ultimate Art of Letting Go",
		category: "Philosophy",
		tone: "Transformative",
		author: "Maria Lopez",
		image:
			"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop",
		gradient: "from-cyan-500 via-blue-600 to-indigo-600",
	},
];

export default function HomePage() {
	const [currentSlide, setCurrentSlide] = useState(0);
	const [featuredLessons, setFeaturedLessons] = useState([]);
	const [mostSaved, setMostSaved] = useState([]);
	const [contributors, setContributors] = useState([]);
	const [loading, setLoading] = useState(true);
	const [openFaq, setOpenFaq] = useState(null);

	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentSlide((prev) => (prev + 1) % heroCarouselCards.length);
		}, 5000);
		return () => clearInterval(timer);
	}, []);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [featured, saved, contribs] = await Promise.all([
					lessonService.getFeatured().catch(() => ({ lessons: [] })),
					lessonService.getMostSaved().catch(() => ({ lessons: [] })),
					lessonService
						.getTopContributors()
						.catch(() => ({ contributors: [] })),
				]);
				setFeaturedLessons(featured.lessons || []);
				setMostSaved(saved.lessons || []);
				setContributors(contribs.contributors || []);
			} catch (e) {
				console.error(e);
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, []);

	const slide = heroCarouselCards[currentSlide];
	const prevSlide = () =>
		setCurrentSlide(
			(p) => (p - 1 + heroCarouselCards.length) % heroCarouselCards.length
		);
	const nextSlide = () =>
		setCurrentSlide((p) => (p + 1) % heroCarouselCards.length);

	return (
		<div className="bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-100 overflow-x-hidden selection:bg-violet-500 selection:text-white">
			{/* Dynamic Background Blob Lights */}
			<div className="absolute top-0 left-0 right-0 h-[1000px] overflow-hidden pointer-events-none z-0">
				<div className="absolute top-[-10%] left-[-15%] w-[50%] h-[600px] rounded-full bg-violet-600/10 blur-[150px] dark:bg-violet-900/15" />
				<div className="absolute top-[20%] right-[-15%] w-[45%] h-[550px] rounded-full bg-purple-600/10 blur-[130px] dark:bg-purple-900/15" />
				<div className="absolute top-[60%] left-[25%] w-[40%] h-[400px] rounded-full bg-pink-500/5 blur-[120px] dark:bg-pink-900/10" />
			</div>

			{/* Hero Section */}
			<section className="relative z-10 pt-8 pb-20 md:py-32">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
						{/* Left - Hero Content */}
						<motion.div
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8 }}
							className="lg:col-span-7 text-center lg:text-left">
							<div className="inline-flex items-center gap-2 px-3 py-1.5 bg-violet-100 dark:bg-violet-900/40 border border-violet-200/50 dark:border-violet-800/30 rounded-full mb-6 shadow-sm">
								<Sparkles
									size={14}
									className="text-violet-600 dark:text-violet-400 animate-pulse"
								/>
								<span className="text-violet-800 dark:text-violet-300 text-xs font-semibold uppercase tracking-wider">
									The Modern Wisdom Exchange
								</span>
							</div>

							<h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
								Turn your{" "}
								<span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-500 dark:from-violet-400 dark:via-purple-400 dark:to-indigo-300">
									experiences
								</span>{" "}
								<br />
								into shared{" "}
								<span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-orange-500">
									wisdom.
								</span>
							</h1>

							<p className="text-lg text-slate-600 dark:text-slate-350 max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed">
								Discover a curated library of life experiences, practical
								teachings, and philosophical insights written by real people.
								Create, read, and evolve together.
							</p>

							<div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-12">
								<Link
									href="/lessons"
									className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-violet-500/25 hover:shadow-violet-600/35 hover:-translate-y-0.5 active:translate-y-0">
									Explore Lessons <ArrowRight size={18} />
								</Link>
								<Link
									href="/register"
									className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-850 hover:border-slate-350 dark:hover:border-slate-700 transition-all duration-350 flex items-center justify-center shadow-sm">
									Write Your Lesson
								</Link>
							</div>

							{/* Stats Widgets */}
							<div className="grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/60 p-4 rounded-2xl shadow-sm">
								<div className="text-center sm:text-left sm:pl-4">
									<p className="text-2xl sm:text-3xl font-extrabold text-violet-600 dark:text-violet-400">
										10K+
									</p>
									<p className="text-xs font-medium text-slate-500 dark:text-slate-450 mt-1">
										Lessons Shared
									</p>
								</div>
								<div className="border-r border-slate-200 dark:border-slate-800" />
								<div className="text-center">
									<p className="text-2xl sm:text-3xl font-extrabold text-purple-600 dark:text-purple-400">
										5K+
									</p>
									<p className="text-xs font-medium text-slate-500 dark:text-slate-450 mt-1">
										Global Creators
									</p>
								</div>
								<div className="border-r border-slate-200 dark:border-slate-800" />
								<div className="text-center sm:text-right sm:pr-4">
									<p className="text-2xl sm:text-3xl font-extrabold text-amber-500 dark:text-amber-450">
										98%
									</p>
									<p className="text-xs font-medium text-slate-500 dark:text-slate-450 mt-1">
										Growth Index
									</p>
								</div>
							</div>
						</motion.div>

						{/* Right - Interactive Slideshow Showcase */}
						<motion.div
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.8, delay: 0.1 }}
							className="lg:col-span-5 relative mt-8 lg:mt-0">
							<div className="relative w-full h-[380px] sm:h-[430px] md:h-[480px] flex items-center justify-center">
								{/* Neon Backlight Glow */}
								<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] h-[85%] bg-gradient-to-tr from-violet-600/30 to-purple-600/30 dark:from-violet-900/35 dark:to-purple-900/35 rounded-3xl blur-[80px] z-0 pointer-events-none" />

								{/* Glassmorphic Rotated Background Card */}
								<div className="absolute top-8 right-6 w-[260px] sm:w-[310px] h-[330px] sm:h-[390px] rounded-3xl bg-white/5 dark:bg-slate-900/10 backdrop-blur-xl border border-white/10 dark:border-slate-850/20 shadow-2xl rotate-[8deg] pointer-events-none transition-all duration-700" />
								<div className="absolute top-12 left-6 w-[260px] sm:w-[310px] h-[330px] sm:h-[390px] rounded-3xl bg-white/5 dark:bg-slate-900/5 backdrop-blur-xl border border-white/5 dark:border-slate-850/10 shadow-xl -rotate-[6deg] pointer-events-none transition-all duration-700" />

								{/* Main Interactive Card */}
								<AnimatePresence mode="wait">
									<motion.div
										key={currentSlide}
										initial={{ opacity: 0, rotate: -2, scale: 0.95 }}
										animate={{ opacity: 1, rotate: 0, scale: 1 }}
										exit={{ opacity: 0, rotate: 2, scale: 0.95 }}
										transition={{ duration: 0.6 }}
										className="relative z-10 w-[270px] sm:w-[320px] h-[340px] sm:h-[400px] rounded-3xl overflow-hidden shadow-2xl border border-white/20 dark:border-slate-800/40 group">
										<img
											src={slide.image}
											alt={slide.title}
											className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
										/>

										{/* Shadow overlay gradient */}
										<div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

										{/* Floating Info inside slide */}
										<div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 text-left">
											<div className="flex items-center gap-2 mb-3">
												<span className="px-2.5 py-0.5 text-[10px] font-semibold bg-white/20 backdrop-blur-md text-white rounded-full uppercase tracking-wider">
													{slide.category}
												</span>
												<span className="px-2.5 py-0.5 text-[10px] font-semibold bg-violet-650/40 backdrop-blur-md text-violet-255 rounded-full uppercase tracking-wider text-purple-200">
													{slide.tone}
												</span>
											</div>

											<h3 className="text-base sm:text-lg font-bold text-white mb-3 leading-snug drop-shadow-md">
												{slide.title}
											</h3>

											<div className="flex items-center justify-between border-t border-white/10 pt-3">
												<div className="flex items-center gap-2">
													<div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-[10px] text-white font-bold">
														{slide.author[0]}
													</div>
													<span className="text-xs text-slate-350">
														{slide.author}
													</span>
												</div>
												<ArrowUpRight
													size={14}
													className="text-white/60 group-hover:text-white transition-colors"
												/>
											</div>
										</div>
									</motion.div>
								</AnimatePresence>

								{/* Floating Widgets */}
								<motion.div
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: 0.4 }}
									className="absolute bottom-4 left-[-10px] sm:left-[-20px] z-20 w-[170px] sm:w-[190px] p-3.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/50 rounded-2xl shadow-xl">
									<Quote
										size={14}
										className="text-violet-500 mb-1.5"
									/>
									<p className="text-[10px] sm:text-xs text-slate-600 dark:text-slate-300 italic font-medium leading-relaxed">
										"Wisdom is not a product of schooling but of the lifelong
										attempt to acquire it."
									</p>
								</motion.div>

								<motion.div
									initial={{ opacity: 0, y: -25 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.5 }}
									className="absolute top-6 right-[-10px] sm:right-[-20px] z-20 px-3.5 py-2.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/50 rounded-2xl shadow-xl flex items-center gap-2.5">
									<div className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center">
										<Bookmark
											size={14}
											className="text-violet-600 dark:text-violet-400"
										/>
									</div>
									<div>
										<p className="text-xs font-extrabold text-slate-900 dark:text-white">
											Active Growth
										</p>
										<p className="text-[9px] text-slate-500">
											Curated weekly topics
										</p>
									</div>
								</motion.div>
							</div>

							{/* Controls */}
							<div className="flex items-center justify-between mt-6 max-w-[270px] sm:max-w-[320px] mx-auto">
								<div className="flex gap-1.5">
									{heroCarouselCards.map((_, i) => (
										<button
											key={i}
											onClick={() => setCurrentSlide(i)}
											className={`h-1.5 rounded-full transition-all duration-300 ${
												i === currentSlide ?
													"w-5 bg-violet-600 dark:bg-violet-400"
												:	"w-1.5 bg-slate-300 dark:bg-slate-700"
											}`}
										/>
									))}
								</div>
								<div className="flex gap-2">
									<button
										onClick={prevSlide}
										className="w-8 h-8 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-650 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors shadow-sm">
										<ChevronLeft size={14} />
									</button>
									<button
										onClick={nextSlide}
										className="w-8 h-8 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-650 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors shadow-sm">
										<ChevronRight size={14} />
									</button>
								</div>
							</div>
						</motion.div>
					</div>
				</div>
			</section>

			{/* New Section 1: How It Works */}
			<section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-slate-200/50 dark:border-slate-800/50">
				<div className="text-center mb-16">
					<span className="text-xs font-bold text-violet-600 dark:text-violet-400 uppercase tracking-widest bg-violet-100 dark:bg-violet-900/30 px-3 py-1 rounded-full">
						Simple Process
					</span>
					<h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-3">
						How the Exchange Works
					</h2>
					<p className="text-slate-550 dark:text-slate-400 mt-2 max-w-lg mx-auto">
						Get started sharing or consuming wisdom in three simple steps.
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
					<div className="hidden md:block absolute top-12 left-20 right-20 h-0.5 bg-gradient-to-r from-violet-200 via-purple-200 to-indigo-200 dark:from-violet-900 dark:via-purple-900 dark:to-indigo-900 z-0" />

					{[
						{
							step: "01",
							title: "Reflect & Write",
							desc: "Identify a pivotal experience or realization in your life and formulate it using our clear layout.",
							icon: Edit2,
						},
						{
							step: "02",
							title: "Review & Publish",
							desc: "Select appropriate categories, set the tone (reflective, alarming, inspirational), and publish to the network.",
							icon: Compass,
						},
						{
							step: "03",
							title: "Inspire & Grow",
							desc: "Get bookmarked by readers worldwide, earn community points, and gain premium status.",
							icon: Sparkles,
						},
					].map(({ step, title, desc, icon: Icon }) => (
						<div
							key={title}
							className="relative z-10 text-center flex flex-col items-center group">
							<div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-900 border-2 border-violet-500 dark:border-violet-450 flex items-center justify-center text-violet-600 dark:text-violet-400 shadow-lg group-hover:scale-105 transition-transform duration-350 mb-6">
								<Icon size={22} />
							</div>
							<span className="text-[10px] font-bold text-violet-650 dark:text-violet-400 tracking-widest uppercase mb-1">
								Step {step}
							</span>
							<h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
								{title}
							</h3>
							<p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-xs">
								{desc}
							</p>
						</div>
					))}
				</div>
			</section>

			{/* Featured Lessons */}
			<section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-slate-200/50 dark:border-slate-800/50">
				<div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12">
					<div>
						<div className="flex items-center gap-2 text-violet-600 dark:text-violet-455 font-semibold text-xs uppercase tracking-wider mb-2">
							<span className="w-1.5 h-1.5 rounded-full bg-violet-600" /> Best
							of platform
						</div>
						<h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
							Featured Lessons
						</h2>
						<p className="text-slate-500 dark:text-slate-400 mt-1">
							Lessons showing great wisdom and outstanding community feedback
						</p>
					</div>
					<Link
						href="/lessons"
						className="group mt-4 sm:mt-0 text-violet-600 hover:text-violet-700 font-semibold flex items-center gap-1 text-sm">
						View All Wisdom{" "}
						<ArrowRight
							size={16}
							className="group-hover:translate-x-1 transition-transform"
						/>
					</Link>
				</div>

				{loading ?
					<GridSkeleton count={3} />
				: featuredLessons.length > 0 ?
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						{featuredLessons.slice(0, 3).map((lesson, i) => (
							<LessonCard
								key={lesson._id}
								lesson={lesson}
								index={i}
							/>
						))}
					</div>
				:	<div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800/80 shadow-sm">
						<BookOpen
							size={40}
							className="mx-auto mb-4 text-slate-400 dark:text-slate-650 opacity-60"
						/>
						<p className="text-slate-500 dark:text-slate-400 font-medium">
							No featured lessons available yet.
						</p>
						<Link
							href="/lessons"
							className="inline-block mt-4 px-5 py-2.5 bg-violet-100 hover:bg-violet-200 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 rounded-xl text-sm font-semibold transition-colors">
							Write the First One
						</Link>
					</div>
				}
			</section>

			{/* New Section 2: Category Explorer */}
			<section className="relative z-10 bg-slate-100/30 dark:bg-slate-900/10 py-24 border-t border-slate-200/50 dark:border-slate-800/50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex flex-col md:flex-row items-center justify-between mb-16">
						<div className="text-center md:text-left">
							<span className="text-xs font-bold text-violet-600 dark:text-violet-400 uppercase tracking-widest">
								Topic Directory
							</span>
							<h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
								Explore Lessons by Topic
							</h2>
						</div>
						<Link
							href="/lessons"
							className="text-sm font-semibold text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-350 mt-4 md:mt-0 flex items-center gap-1">
							Browse All Categories <ArrowUpRight size={14} />
						</Link>
					</div>

					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
						{[
							{
								label: "Personal Growth",
								count: "1,240 lessons",
								icon: Brain,
								color:
									"text-violet-600 bg-violet-100 dark:bg-violet-950/50 dark:text-violet-400",
							},
							{
								label: "Career",
								count: "984 lessons",
								icon: Briefcase,
								color:
									"text-blue-600 bg-blue-100 dark:bg-blue-950/50 dark:text-blue-400",
							},
							{
								label: "Relationships",
								count: "850 lessons",
								icon: Heart,
								color:
									"text-rose-600 bg-rose-100 dark:bg-rose-950/50 dark:text-rose-400",
							},
							{
								label: "Wellness",
								count: "730 lessons",
								icon: Smile,
								color:
									"text-emerald-600 bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-400",
							},
							{
								label: "Philosophy",
								count: "540 lessons",
								icon: Compass,
								color:
									"text-amber-600 bg-amber-100 dark:bg-amber-950/50 dark:text-amber-400",
							},
							{
								label: "Adversity",
								count: "410 lessons",
								icon: Shield,
								color:
									"text-purple-600 bg-purple-100 dark:bg-purple-950/50 dark:text-purple-400",
							},
						].map(({ label, count, icon: Icon, color }) => (
							<Link
								key={label}
								href={`/lessons?category=${encodeURIComponent(label)}`}
								className="group p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:shadow-xl hover:shadow-violet-500/5 hover:border-violet-350 dark:hover:border-violet-850 transition-all duration-300">
								<div
									className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${color}`}>
									<Icon size={18} />
								</div>
								<h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1 group-hover:text-violet-650 transition-colors">
									{label}
								</h3>
								<p className="text-[11px] text-slate-450 dark:text-slate-400 font-medium">
									{count}
								</p>
							</Link>
						))}
					</div>
				</div>
			</section>

			{/* Modern Why Learning Matters Section */}
			<section className="relative z-10 py-24 border-y border-slate-200/50 dark:border-slate-800/50 bg-slate-100/40 dark:bg-slate-950/20">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-16">
						<h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
							Why Share Life Lessons?
						</h2>
						<p className="text-slate-550 dark:text-slate-450 mt-2 max-w-xl mx-auto">
							We gather experiences, but true growth happens when we
							conceptualize them and pass them on.
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						{[
							{
								icon: BookOpen,
								title: "Structured Reflection",
								desc: "Writing down your learnings helps you understand your own journey and build emotional resilience.",
								color: "from-violet-500 to-purple-600",
							},
							{
								icon: Users,
								title: "Global Compassion",
								desc: "Read authentic experiences of peers worldwide to expand your perspective and practice empathy.",
								color: "from-pink-500 to-rose-600",
							},
							{
								icon: TrendingUp,
								title: "Collective Growth",
								desc: "Be part of an evolving wisdom registry. Guide and be guided through complex modern scenarios.",
								color: "from-amber-500 to-orange-600",
							},
						].map(({ icon: Icon, title, desc, color }, i) => (
							<motion.div
								key={title}
								initial={{ opacity: 0, y: 24 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.6, delay: i * 0.1 }}
								viewport={{ once: true }}
								className="group relative bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 hover:shadow-2xl hover:shadow-violet-500/5 transition-all duration-300 hover:-translate-y-1">
								<div
									className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-6 shadow-md shadow-violet-500/10`}>
									<Icon
										size={20}
										className="text-white"
									/>
								</div>
								<h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 group-hover:text-violet-650 transition-colors">
									{title}
								</h3>
								<p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
									{desc}
								</p>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* Top Contributors */}
			<section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
				<div className="text-center mb-16">
					<h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
						Wisdom Keepers
					</h2>
					<p className="text-slate-500 dark:text-slate-450 mt-2">
						Our most prolific and highly rated insight creators
					</p>
				</div>

				{contributors.length > 0 ?
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
						{contributors.map((c, i) => (
							<motion.div
								key={c._id}
								initial={{ opacity: 0, y: 15 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, delay: i * 0.05 }}
								viewport={{ once: true }}
								className="group text-center p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl hover:border-violet-300 dark:hover:border-violet-900 hover:shadow-xl hover:shadow-violet-500/5 transition-all duration-300">
								<div className="relative w-16 h-16 mx-auto mb-4">
									{c.photo ?
										<img
											src={c.photo}
											alt={c.name}
											className="w-full h-full rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-800 group-hover:ring-violet-500 transition-all duration-300"
										/>
									:	<div className="w-full h-full rounded-full bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-950 dark:to-purple-950 flex items-center justify-center text-violet-650 dark:text-violet-300 font-extrabold text-lg">
											{c.name?.[0]}
										</div>
									}
									{i < 3 && (
										<div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-500 border-2 border-white dark:border-slate-900 flex items-center justify-center text-[10px] text-white font-extrabold">
											#{i + 1}
										</div>
									)}
								</div>
								<p className="font-bold text-sm text-slate-900 dark:text-white truncate group-hover:text-violet-600 transition-colors">
									{c.name}
								</p>
								<div className="inline-flex items-center gap-1 mt-1 text-[11px] font-semibold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/40 px-2.5 py-0.5 rounded-full">
									{c.lessonCount} Lessons
								</div>
							</motion.div>
						))}
					</div>
				:	<div className="text-center py-12 text-slate-400">
						<Users
							size={32}
							className="mx-auto mb-3 opacity-40"
						/>
						<p className="text-sm">No contributors registered yet.</p>
					</div>
				}
			</section>

			{/* New Section 3: Live Community Activity */}
			<section className="relative z-10 py-24 border-t border-slate-200/50 dark:border-slate-800/50 bg-slate-100/40 dark:bg-slate-950/20">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
						<div className="lg:col-span-5">
							<span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 dark:bg-emerald-950/40 border border-emerald-200/30 text-emerald-700 dark:text-emerald-350 rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
								<span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />{" "}
								Live Activity
							</span>
							<h2 className="text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
								Wisdom Exchange in Action
							</h2>
							<p className="text-slate-555 dark:text-slate-400 mt-4 leading-relaxed">
								Our platform never sleeps. Learners from all around the globe
								are writing lessons, exchanging feedback, and bookmarking
								templates right now.
							</p>
							<div className="mt-8 flex gap-8">
								<div>
									<p className="text-2xl font-bold text-slate-900 dark:text-white">
										1,400+
									</p>
									<p className="text-xs text-slate-550 font-medium mt-0.5">
										Online Now
									</p>
								</div>
								<div className="w-px h-10 bg-slate-200 dark:bg-slate-800" />
								<div>
									<p className="text-2xl font-bold text-slate-900 dark:text-white">
										2.4k
									</p>
									<p className="text-xs text-slate-550 font-medium mt-0.5">
										Likes Today
									</p>
								</div>
							</div>
						</div>

						<div className="lg:col-span-7 space-y-4">
							{[
								{
									time: "Just now",
									user: "Liam Reynolds",
									action: "published",
									details: "Lessons on Letting Go of Past Grudges",
									label: "Philosophy",
								},
								{
									time: "2m ago",
									user: "Zoe Winters",
									action: "bookmarked",
									details: "Navigating Remote Team Dynamics",
									label: "Career",
								},
								{
									time: "5m ago",
									user: "Marcus Chen",
									action: "reached Rank #3",
									details: "Top Contributor status updated",
									label: "Status",
								},
							].map(({ time, user, action, details, label }) => (
								<div
									key={user + action}
									className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm transition-all hover:translate-x-1 duration-200">
									<div className="flex items-center gap-3">
										<div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-violet-950 dark:to-indigo-950 flex items-center justify-center text-xs text-violet-650 dark:text-violet-300 font-bold uppercase">
											{user[0]}
										</div>
										<div>
											<p className="text-xs text-slate-850 dark:text-slate-200 font-medium">
												<strong className="text-slate-900 dark:text-white font-bold">
													{user}
												</strong>{" "}
												{action}{" "}
												<span className="italic text-slate-500 font-normal">
													"{details}"
												</span>
											</p>
											<span className="text-[10px] text-slate-400 mt-0.5 block">
												{time}
											</span>
										</div>
									</div>
									<span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-550 dark:text-slate-400 rounded-md text-[10px] font-semibold">
										{label}
									</span>
								</div>
							))}
						</div>
					</div>
				</div>
			</section>

			{/* Most Saved Lessons */}
			<section className="relative z-10 bg-slate-900 dark:bg-slate-900 border-y border-slate-800/80 py-24 text-white">
				{/* Soft Background Radial Light */}
				<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(124,58,237,0.08),transparent_70%)] z-0 pointer-events-none" />

				<div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-16">
						<div>
							<div className="flex items-center gap-2 text-pink-500 font-semibold text-xs uppercase tracking-wider mb-2">
								<Heart
									size={12}
									className="fill-pink-500"
								/>{" "}
								Popular Knowledge
							</div>
							<h2 className="text-3xl font-extrabold text-white">
								Trending Insights
							</h2>
							<p className="text-slate-400 mt-1">
								Lessons that have been saved and bookmarks most frequently by
								our community members
							</p>
						</div>
						<Link
							href="/lessons"
							className="group mt-4 sm:mt-0 text-pink-400 hover:text-pink-300 font-semibold flex items-center gap-1 text-sm">
							Discover Trending{" "}
							<ArrowRight
								size={16}
								className="group-hover:translate-x-1 transition-transform"
							/>
						</Link>
					</div>

					{loading ?
						<GridSkeleton count={3} />
					: mostSaved.length > 0 ?
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
							{mostSaved.slice(0, 6).map((lesson, i) => (
								<LessonCard
									key={lesson._id}
									lesson={lesson}
									index={i}
								/>
							))}
						</div>
					:	<div className="text-center py-12 text-slate-500">
							<Heart
								size={32}
								className="mx-auto mb-3 opacity-40"
							/>
							<p className="text-sm">No trending lessons found yet.</p>
						</div>
					}
				</div>
			</section>

			{/* New Section 4: Success Testimonials */}
			<section className="relative z-10 py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-16">
					<span className="text-xs font-bold text-violet-600 dark:text-violet-400 uppercase tracking-widest">
						Impact Stories
					</span>
					<h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-3">
						Transformed by Shared Wisdom
					</h2>
					<p className="text-slate-550 dark:text-slate-450 mt-2 max-w-lg mx-auto">
						Read how life lessons from strangers helped change paths and
						mindsets.
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					{[
						{
							quote:
								"As a young founder, reading the failures and pivot lessons of senior engineers here kept me from making costly mistakes.",
							author: "Nadim Ahsan",
							role: "Startup Founder",
							avatar: "N",
						},
						{
							quote:
								"The personal growth category has been an anchor. I read a lesson every morning with my tea—it keeps me grounded and resilient.",
							author: "Zarah Al-Farsi",
							role: "Creative Director",
							avatar: "Z",
						},
						{
							quote:
								"Sharing my life lesson was incredibly therapeutic. Knowing my hard-earned experiences help someone else is a powerful feeling.",
							author: "Devon Miller",
							role: "Retired Educator",
							avatar: "D",
						},
					].map(({ quote, author, role, avatar }) => (
						<div
							key={author}
							className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl relative flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
							<p className="text-slate-650 dark:text-slate-300 italic text-sm leading-relaxed mb-6">
								"{quote}"
							</p>
							<div className="flex items-center gap-3">
								<div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
									{avatar}
								</div>
								<div>
									<h4 className="text-sm font-bold text-slate-900 dark:text-white">
										{author}
									</h4>
									<p className="text-[10px] text-slate-450 dark:text-slate-400">
										{role}
									</p>
								</div>
							</div>
						</div>
					))}
				</div>
			</section>

			{/* New Section 5: FAQ Accordion */}
			<section className="relative z-10 py-24 bg-slate-100/30 dark:bg-slate-900/10 border-t border-slate-200/50 dark:border-slate-800/50">
				<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-16">
						<span className="text-xs font-bold text-violet-600 dark:text-violet-400 uppercase tracking-widest">
							Common Questions
						</span>
						<h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-3">
							Frequently Asked Questions
						</h2>
					</div>

					<div className="space-y-4">
						{[
							{
								q: "Is it free to publish lessons on the platform?",
								a: "Yes, absolutely! Publishing lessons is and always will be completely free. We want to democratize access to real life experiences and wisdom.",
							},
							{
								q: "What additional features do Premium members get?",
								a: "Premium members get access to visual design layout templates, advanced tone analysis, content priority placements on the home page, and the ability to download lessons as PDF formats.",
							},
							{
								q: "Are all published lessons moderated?",
								a: "Yes. To ensure our community remains safe, supportive, and clean, all lessons are scanned automatically and reviewed by our moderation team for harmful or false content.",
							},
							{
								q: "Can I bookmark or download other people’s lessons?",
								a: "Registered users can bookmark/save lessons which will appear under their favorite tab. Premium members can also export lessons.",
							},
						].map(({ q, a }, idx) => (
							<div
								key={idx}
								className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
								<button
									onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
									className="w-full px-6 py-5 text-left flex items-center justify-between font-bold text-slate-900 dark:text-white hover:bg-rose-600 dark:hover:bg-rose-600 transition-colors outline-none">
									<span className="text-sm sm:text-base">{q}</span>
									<ChevronDown
										size={16}
										className={`transition-transform duration-300 flex-shrink-0 ml-4 ${openFaq === idx ? "rotate-180 text-violet-500" : ""}`}
									/>
								</button>
								{openFaq === idx && (
									<div className="px-6 pb-5 text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-850/50 pt-4">
										{a}
									</div>
								)}
							</div>
						))}
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
				<div className="relative bg-gradient-to-br from-violet-600 via-purple-700 to-indigo-800 rounded-[2.5rem] p-8 md:p-16 text-center overflow-hidden shadow-2xl shadow-violet-900/20">
					{/* Decorative Circles */}
					<div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-3xl pointer-events-none" />
					<div className="absolute bottom-[-100px] left-[-100px] w-[350px] h-[350px] bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

					<div className="relative z-10 max-w-2xl mx-auto">
						<div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/15">
							<Crown
								size={22}
								className="text-yellow-450 text-amber-300"
							/>
						</div>

						<h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
							Ready to leave your digital legacy?
						</h2>

						<p className="text-slate-200 text-base md:text-lg mb-8 leading-relaxed">
							Join thousands of creators sharing real experiences, challenges,
							and insights. Empower your voice, upgrade to premium, and unlock
							deep content templates.
						</p>

						<div className="flex flex-col sm:flex-row items-center justify-center gap-4">
							<Link
								href="/register"
								className="w-full sm:w-auto px-8 py-4 bg-rose-500 text-white font-bold rounded-2xl transition-all duration-300 shadow-xl shadow-black/10 hover:-translate-y-0.5 cursor-pointer">
								Join the Network Free
							</Link>
							<Link
								href="/pricing"
								className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/15 backdrop-blur-md text-white font-bold rounded-2xl border border-white/20 transition-all duration-300">
								See Premium Features
							</Link>
						</div>

						<div className="flex items-center justify-center gap-6 mt-12 text-white/60 text-xs">
							<span className="flex items-center gap-1.5">
								<CheckCircle2
									size={12}
									className="text-emerald-450 text-green-400"
								/>{" "}
								No credit card required
							</span>
							<span className="w-1 h-1 rounded-full bg-white/30" />
							<span className="flex items-center gap-1.5">
								<CheckCircle2
									size={12}
									className="text-emerald-450 text-green-400"
								/>{" "}
								Cancel anytime
							</span>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
