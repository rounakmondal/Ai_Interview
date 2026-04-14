import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProfileButton from "@/components/ProfileButton";
import { usePageSEO } from "@/lib/page-seo";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Trophy,
  Medal,
  MapPin,
  BarChart3,
  Calendar,
  Crown,
  Star,
  TrendingUp,
  Zap,
} from "lucide-react";
import { fetchLeaderboard, LeaderboardEntry } from "@/lib/govt-practice-data";

type Filter = "weekly" | "monthly";

const badgeStyles: Record<LeaderboardEntry["badge"], string> = {
  gold: "bg-amber-400 text-amber-900",
  silver: "bg-slate-300 text-slate-800",
  bronze: "bg-orange-400 text-orange-900",
  standard: "bg-muted text-muted-foreground",
};

const rankIcon = (rank: number) => {
  if (rank === 1) return <Crown className="w-4 h-4 text-amber-500" />;
  if (rank === 2) return <Medal className="w-4 h-4 text-slate-400" />;
  if (rank === 3) return <Medal className="w-4 h-4 text-orange-500" />;
  return <span className="text-sm font-bold text-muted-foreground">{rank}</span>;
};

export default function Leaderboard() {
  usePageSEO("/leaderboard");
  const [filter, setFilter] = useState<Filter>("weekly");
  const [sorted, setSorted] = useState<LeaderboardEntry[]>([]);
  const [loadingLB, setLoadingLB] = useState(true);

  useEffect(() => {
    setLoadingLB(true);
    fetchLeaderboard(filter).then((data) => { setSorted(data); setLoadingLB(false); });
  }, [filter]);

  const top3 = sorted.slice(0, 3);
  const rest = sorted.slice(3);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 sticky top-0 z-50 bg-background/95 backdrop-blur">
        <div className="container px-4 h-14 flex items-center gap-3">
          <Link to="/" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Home
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-sm font-medium">Leaderboard</span>
          <div className="ml-auto"><ProfileButton /></div>
        </div>
      </header>

      <main className="container px-4 py-8 max-w-3xl mx-auto space-y-8">
        {/* Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-sm font-medium border border-amber-500/20">
            <Trophy className="w-3.5 h-3.5" />
            Top Performers — West Bengal
          </div>
          <h1 className="text-3xl font-bold">Leaderboard</h1>
          <p className="text-muted-foreground text-sm">
            Based on average accuracy scores across mock tests.
          </p>
        </div>

        {/* Filter */}
        <div className="flex gap-2 justify-center">
          {(["weekly", "monthly"] as Filter[]).map((f) => (
            <Button
              key={f}
              variant={filter === f ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(f)}
              className={`gap-1.5 capitalize ${filter === f ? "gradient-primary" : ""}`}
            >
              {f === "weekly" ? <Calendar className="w-3.5 h-3.5" /> : <TrendingUp className="w-3.5 h-3.5" />}
              {f}
            </Button>
          ))}
        </div>

        {/* Top 3 Podium */}
        <div className="grid grid-cols-3 gap-3 items-end">
          {/* 2nd place */}
          <Card className="p-4 text-center border-slate-400/30 bg-slate-400/5 space-y-2">
            <div className="mx-auto w-12 h-12 rounded-full bg-slate-300 dark:bg-slate-600 flex items-center justify-center text-base font-bold text-slate-800 dark:text-white">
              {top3[1]?.avatar}
            </div>
            <div>
              <p className="text-xs font-bold truncate">{top3[1]?.name.split(" ")[0]}</p>
              <p className="text-xs text-muted-foreground truncate">{top3[1]?.district}</p>
            </div>
            <div className="bg-slate-300 dark:bg-slate-600 rounded-lg py-2">
              <Medal className="w-4 h-4 text-slate-600 dark:text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                {filter === "weekly" ? top3[1]?.weeklyScore : top3[1]?.monthlyScore}%
              </p>
            </div>
            <Badge className="bg-slate-300 text-slate-800 text-xs w-full justify-center">#2</Badge>
          </Card>

          {/* 1st place */}
          <Card className="p-4 text-center border-amber-400/40 bg-amber-400/10 space-y-2 relative">
            <Crown className="w-5 h-5 text-amber-500 absolute -top-2.5 left-1/2 -translate-x-1/2" />
            <div className="mx-auto w-14 h-14 rounded-full bg-amber-400 flex items-center justify-center text-base font-bold text-amber-900">
              {top3[0]?.avatar}
            </div>
            <div>
              <p className="text-sm font-bold truncate">{top3[0]?.name.split(" ")[0]}</p>
              <p className="text-xs text-muted-foreground truncate">{top3[0]?.district}</p>
            </div>
            <div className="bg-amber-400 rounded-lg py-2">
              <Trophy className="w-4 h-4 text-amber-900 mx-auto" />
              <p className="text-base font-bold text-amber-900">
                {filter === "weekly" ? top3[0]?.weeklyScore : top3[0]?.monthlyScore}%
              </p>
            </div>
            <Badge className="bg-amber-400 text-amber-900 text-xs w-full justify-center">#1</Badge>
          </Card>

          {/* 3rd place */}
          <Card className="p-4 text-center border-orange-400/30 bg-orange-400/5 space-y-2">
            <div className="mx-auto w-12 h-12 rounded-full bg-orange-300 dark:bg-orange-700 flex items-center justify-center text-base font-bold text-orange-900 dark:text-white">
              {top3[2]?.avatar}
            </div>
            <div>
              <p className="text-xs font-bold truncate">{top3[2]?.name.split(" ")[0]}</p>
              <p className="text-xs text-muted-foreground truncate">{top3[2]?.district}</p>
            </div>
            <div className="bg-orange-300 dark:bg-orange-700 rounded-lg py-2">
              <Medal className="w-4 h-4 text-orange-700 dark:text-orange-200 mx-auto" />
              <p className="text-sm font-bold text-orange-800 dark:text-orange-100">
                {filter === "weekly" ? top3[2]?.weeklyScore : top3[2]?.monthlyScore}%
              </p>
            </div>
            <Badge className="bg-orange-300 text-orange-900 text-xs w-full justify-center">#3</Badge>
          </Card>
        </div>

        {/* Rest of leaderboard */}
        <Card className="border-border/40 overflow-hidden">
          <div className="px-5 py-3 border-b border-border/40 bg-muted/30 flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            <BarChart3 className="w-3.5 h-3.5" />
            Rankings 4–{sorted.length}
          </div>
          <div className="divide-y divide-border/30">
            {rest.map((entry) => {
              const score = filter === "weekly" ? entry.weeklyScore : entry.monthlyScore;
              return (
                <div key={entry.rank} className="px-5 py-4 flex items-center gap-4 hover:bg-muted/30 transition-colors">
                  {/* Rank */}
                  <div className="w-7 flex items-center justify-center flex-shrink-0">
                    {rankIcon(entry.rank)}
                  </div>

                  {/* Avatar */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${badgeStyles[entry.badge]}`}>
                    {entry.avatar.slice(0, 2)}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{entry.name}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      {entry.district}, {entry.state}
                    </div>
                  </div>

                  {/* Tests */}
                  <div className="hidden sm:block text-center">
                    <p className="text-xs text-muted-foreground">Tests</p>
                    <p className="text-sm font-semibold">{entry.totalTests}</p>
                  </div>

                  {/* Score */}
                  <div className="text-right">
                    <p className={`text-lg font-bold ${score >= 85 ? "text-green-600 dark:text-green-400" : score >= 75 ? "text-primary" : "text-muted-foreground"}`}>
                      {score}%
                    </p>
                    <p className="text-xs text-muted-foreground">{filter}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* CTA */}
        <Card className="p-6 text-center border-primary/20 bg-primary/5 space-y-3">
          <Star className="w-7 h-7 text-primary mx-auto" />
          <h3 className="font-bold">Want to appear on the leaderboard?</h3>
          <p className="text-sm text-muted-foreground">Take more mock tests to improve your rank among West Bengal aspirants.</p>
          <Link to="/govt-practice">
            <Button className="gradient-primary gap-2">
              <Zap className="w-4 h-4" />
              Start Practising
            </Button>
          </Link>
        </Card>
      </main>
    </div>
  );
}
