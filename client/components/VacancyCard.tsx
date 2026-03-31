import { motion } from "framer-motion";
import { Vacancy } from "@shared/api";
import { Calendar, Building, ArrowRight } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";

interface VacancyCardProps {
  vacancy: Vacancy;
}

export function VacancyCard({ vacancy }: VacancyCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="h-full border-indigo-100 hover:border-indigo-300 transition-colors shadow-sm hover:shadow-md">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start mb-2">
            <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-100">
              {vacancy.exam_name}
            </Badge>
            <div className="flex items-center text-xs text-muted-foreground">
              <Calendar className="w-3 h-3 mr-1" />
              {vacancy.date}
            </div>
          </div>
          <CardTitle className="text-lg font-bold leading-tight line-clamp-2">
            {vacancy.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <Building className="w-4 h-4 mr-2 text-indigo-500" />
            <span>Source: {vacancy.source}</span>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            variant="ghost" 
            className="w-full justify-between text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 px-2"
            onClick={() => window.open(vacancy.details_url, "_blank")}
          >
            <span>View Details</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
