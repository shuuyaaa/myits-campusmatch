// User roles
export type UserRole = "STUDENT" | "ADMIN" | "SUPER_ADMIN";

// Opportunity status
export type OpportunityStatus = "DRAFT" | "UPCOMING" | "OPEN" | "CLOSED" | "ARCHIVED";

// Opportunity category
export type OpportunityCategory =
  | "SCHOLARSHIP"
  | "ORGANIZATION"
  | "COMPETITION"
  | "COMMITTEE"
  | "UKM"
  | "RESEARCH";

// Match status
export type MatchStatus = "ELIGIBLE" | "PARTIAL" | "INELIGIBLE";

// Gap item — represents a single gap between a student's profile and a requirement
export interface GapItem {
  requirement: string;
  currentValue: string | number | null;
  requiredValue: string | number;
  gapType: "GPA" | "SEMESTER" | "SKILL" | "DOCUMENT" | "MAJOR" | "OTHER";
  actionRequired: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
}

// Student profile extracted from CV parsing
export interface ParsedProfile {
  skills: string[];
  experiences: {
    title: string;
    organization: string;
    duration: string;
    description: string;
  }[];
  interests: string[];
  achievements: string[];
  languages: string[];
}

// Result of matching a student against an opportunity
export interface MatchResult {
  opportunityId: string;
  score: number;
  status: MatchStatus;
  matchedCriteria: string[];
  gaps: GapItem[];
  recommendation: string;
}

// Aggregated dashboard statistics
export interface DashboardStats {
  totalOpportunities: number;
  eligibleMatches: number;
  upcomingDeadlines: number;
  profileCompleteness: number;
  gapItems: number;
}
