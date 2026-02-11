/*
 * Home Landing Page — Obsidian Forge Design
 * Hero with generated background, stats bar, featured skills, CTA
 * Light text on dark image background, indigo-purple accents
 */
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  Star, ArrowRight, Download, GitBranch, Sparkles, Search,
  LayoutGrid, Database, PenTool, BarChart3, ExternalLink, Zap, Globe, Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSkills } from "@/hooks/useSkills";
import { useDashboard } from "@/hooks/useDashboard";
import { formatNumber as fmtNum } from "@/lib/constants";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const HERO_BG = "https://private-us-east-1.manuscdn.com/sessionFile/2eBPdDBCEBwEDx4LHZAzzK/sandbox/UvtV8h7JfshRTc8tak0YtI-img-1_1770631684000_na1fn_aGVyby1iZw.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvMmVCUGREQkNFQndFRHg0TEhaQXp6Sy9zYW5kYm94L1V2dFY4aDdKZnNoUlRjOHRhazBZdEktaW1nLTFfMTc3MDYzMTY4NDAwMF9uYTFmbl9hR1Z5YnkxaVp3LnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=D~32~XQDssw~XDYT3vwaj60MavhypyNgf1tFG40PvW5smBad2oR99ZV7eRFmARY59R4QUkesi2ujx7hK6kXJcXp~WAlMMGIAbv1EpEiUSyaXSjpYvtP3miSylu~rZ7GpzI0XI9EPaMaVeczvYK~22o50~CnIjh7Q4Yr9RzVRr0oM0YP3CZUq2JgndkiOyaqMYdtSu~rOPm3ZqPuoTyBDAs-drt~3nTEno5wdixIYAk8PiSIt5tW3PvzyQWrs-x492gRd6N2yRSFgHnnJz7fJN0g2dERTXNwg-z0vgNqkPmCVtsZfZleamepWwKeEFsVd2qvHkfIsscQ58zCx4ofHgQ__";

const NODES_BG = "https://private-us-east-1.manuscdn.com/sessionFile/2eBPdDBCEBwEDx4LHZAzzK/sandbox/UvtV8h7JfshRTc8tak0YtI-img-4_1770631681000_na1fn_YWJzdHJhY3Qtbm9kZXM.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvMmVCUGREQkNFQndFRHg0TEhaQXp6Sy9zYW5kYm94L1V2dFY4aDdKZnNoUlRjOHRhazBZdEktaW1nLTRfMTc3MDYzMTY4MTAwMF9uYTFmbl9ZV0p6ZEhKaFkzUXRibTlrWlhNLnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=GQVu922WRnpmRViz4MI5xXbi2XqKaeayYbhIoFLeehzz2eCVvol7-jKeHJr8fRwOcUyZBxZHOlEeRANCWYvZH5zjPOdOTqRQx1Sr1yS~DUCOQHSvXlpa-ywqkqz6zEODtObFMJapBq9mN41sDK9oS3n0y0jHcXZgbCNQqMnRK2Ebvn~j0aKQG5J9eUcE-mVDSxQTpWdv0wQMLykUx8pAf5JeMtktapvia8H7LxQPm9NW409QO8gIqB9WYlG7YA6jnqAIfZchgaU0kXKxuisxVmQy~woMmVod1EkagP-SDgqVBboEtVXaL-TLD2by~nCmbsina1qiwcVfojR-tqQmHw__";

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

function formatNumber(n: number) {
  if (n >= 1000) return (n / 1000).toFixed(1) + "k";
  return n.toString();
}

export default function Home() {
  const { t } = useTranslation();
  const { data: skillsData } = useSkills({ sort: "-stars", page: 1, pageSize: 6 });
  const { stats } = useDashboard();
  const topSkills = skillsData?.items || [];

  const totalSkills = stats?.total_skills ?? "—";
  const totalSources = stats?.total_sources ?? "—";
  const totalStars = stats?.total_stars != null ? fmtNum(stats.total_stars) : "—";
  const totalDownloads = stats?.total_downloads != null ? fmtNum(stats.total_downloads) : "—";

  return (
    <div className="min-h-screen bg-background">
      {/* Top Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <span className="font-bold text-lg tracking-tight">Skill MarketPlace</span>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/marketplace" className="hover:text-foreground transition-colors">{t('nav.marketplace')}</Link>
            <Link href="/sources" className="hover:text-foreground transition-colors">{t('nav.sources')}</Link>
            <Link href="/editor" className="hover:text-foreground transition-colors">{t('nav.editor')}</Link>
            <Link href="/dashboard" className="hover:text-foreground transition-colors">{t('nav.dashboard')}</Link>
          </nav>
          <div className="flex items-center gap-3">
            <LanguageSwitcher side="bottom" />
            <Link href="/marketplace">
              <Button variant="outline" size="sm" className="hidden sm:flex gap-1.5 bg-transparent border-border/60 text-muted-foreground hover:text-foreground">
                <Search className="w-3.5 h-3.5" />
                {t('home.searchSkills')}
              </Button>
            </Link>
            <Link href="/marketplace">
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                {t('home.explore')}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-14 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={HERO_BG} alt="" className="w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/60 to-background" />
        </div>

        <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 sm:pt-28 sm:pb-32">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="max-w-3xl"
          >
            <motion.div variants={fadeUp} className="mb-6">
              <Badge variant="outline" className="bg-primary/10 border-primary/30 text-primary px-3 py-1 text-xs font-medium">
                <Zap className="w-3 h-3 mr-1.5" /> {t('home.badge')}
              </Badge>
            </motion.div>

            <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
              {t('home.heroTitle1')}<br />
              <span className="bg-gradient-to-r from-primary via-[oklch(0.65_0.2_300)] to-[oklch(0.75_0.15_195)] bg-clip-text text-transparent">
                {t('home.heroTitle2')}
              </span>
            </motion.h1>

            <motion.p variants={fadeUp} className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-8 max-w-2xl">
              {t('home.heroDesc')}
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
              <Link href="/marketplace">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 h-11 px-6">
                  <LayoutGrid className="w-4 h-4" />
                  {t('home.browseMarketplace')}
                </Button>
              </Link>
              <Link href="/editor">
                <Button size="lg" variant="outline" className="bg-transparent border-border/60 gap-2 h-11 px-6 hover:bg-accent/50">
                  <PenTool className="w-4 h-4" />
                  {t('home.createSkill')}
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="relative z-10 border-y border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border/50">
            {[
              { label: t('home.totalSkills'), value: totalSkills, icon: Sparkles },
              { label: t('home.githubSources'), value: totalSources, icon: Database },
              { label: t('home.totalStars'), value: totalStars, icon: Star },
              { label: t('home.downloads'), value: totalDownloads, icon: Download },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-3 py-5 px-4 sm:px-6">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <stat.icon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold tracking-tight">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Skills Section */}
      <section className="py-16 sm:py-20">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">{t('home.topSkills')}</h2>
              <p className="text-muted-foreground">{t('home.topSkillsDesc')}</p>
            </div>
            <Link href="/marketplace">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground gap-1.5">
                {t('common.viewAll')} <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {topSkills.map((skill, i) => (
              <motion.div key={skill.id} variants={fadeUp}>
                <Link href={`/skills/${skill.id}`}>
                  <div className="group relative rounded-xl border border-border/60 bg-card/80 p-5 transition-all duration-300 hover:border-border hover:bg-card hover:shadow-[0_0_30px_rgba(99,102,241,0.06)]">
                    {/* Rank badge */}
                    <div className="absolute top-4 right-4 w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xs font-bold text-primary">#{i + 1}</span>
                    </div>

                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-[oklch(0.75_0.15_195)]/20 flex items-center justify-center shrink-0 border border-border/40">
                        <span className="text-sm font-bold text-primary">{skill.name.charAt(0).toUpperCase()}</span>
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-sm group-hover:text-primary transition-colors truncate pr-8">
                          {skill.name}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">{skill.source.name}</p>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-4">
                      {skill.description}
                    </p>

                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-amber-400" />
                        {formatNumber(skill.stars)}
                      </span>
                      <span className="flex items-center gap-1">
                        <GitBranch className="w-3 h-3" />
                        {skill.forks}
                      </span>
                      <span className="flex items-center gap-1">
                        <Download className="w-3 h-3" />
                        {formatNumber(skill.downloads)}
                      </span>
                      <div className="ml-auto flex gap-1.5">
                        {skill.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0 h-5 bg-secondary/80">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20 border-t border-border/50 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-1/2 h-full opacity-20 pointer-events-none">
          <img src={NODES_BG} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">{t('home.featuresTitle')}</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              {t('home.featuresDesc')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: Globe,
                title: t('home.featureAggTitle'),
                desc: t('home.featureAggDesc'),
                color: "from-primary/20 to-primary/5",
              },
              {
                icon: Search,
                title: t('home.featureSearchTitle'),
                desc: t('home.featureSearchDesc'),
                color: "from-[oklch(0.75_0.15_195)]/20 to-[oklch(0.75_0.15_195)]/5",
              },
              {
                icon: PenTool,
                title: t('home.featureEditTitle'),
                desc: t('home.featureEditDesc'),
                color: "from-[oklch(0.65_0.2_320)]/20 to-[oklch(0.65_0.2_320)]/5",
              },
              {
                icon: Shield,
                title: t('home.featureQualityTitle'),
                desc: t('home.featureQualityDesc'),
                color: "from-[oklch(0.7_0.18_150)]/20 to-[oklch(0.7_0.18_150)]/5",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-border/60 bg-card/60 p-6 hover:border-border hover:bg-card/80 transition-all duration-300"
              >
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 border border-border/30`}>
                  <feature.icon className="w-5 h-5 text-foreground/80" />
                </div>
                <h3 className="font-semibold text-sm mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 border-t border-border/50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">
            {t('home.ctaTitle')}
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            {t('home.ctaDesc', { skills: totalSkills, sources: totalSources })}
          </p>
          <div className="flex justify-center gap-3">
            <Link href="/marketplace">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 h-11 px-6">
                <LayoutGrid className="w-4 h-4" />
                {t('home.openMarketplace')}
              </Button>
            </Link>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="bg-transparent border-border/60 gap-2 h-11 px-6 hover:bg-accent/50">
                <ExternalLink className="w-4 h-4" />
                {t('home.viewOnGithub')}
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>{t('home.footer')}</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>{t('home.builtWith')}</span>
            <span className="w-1 h-1 rounded-full bg-border" />
            <span>Apache-2.0 license</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
