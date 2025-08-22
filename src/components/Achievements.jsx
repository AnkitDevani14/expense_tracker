import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  LinearProgress,
  Avatar,
  Tooltip,
  IconButton,
  Badge,
  Divider,
  Fade,
  Zoom
} from '@mui/material';
import {
  EmojiEvents as TrophyIcon,
  LocalFireDepartment as FireIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
  Savings as SavingsIcon,
  CalendarToday as CalendarIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as UncheckedIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import AchievementNotification from './AchievementNotification';
import StreakCelebration from './StreakCelebration';

// Achievement definitions
const ACHIEVEMENTS = {
  firstExpense: {
    id: 'firstExpense',
    title: 'First Step',
    description: 'Add your first expense',
    icon: StarIcon,
    color: '#ffd600',
    points: 10
  },
  weekStreak: {
    id: 'weekStreak',
    title: 'Weekly Warrior',
    description: 'Track expenses for 7 consecutive days',
    icon: FireIcon,
    color: '#ff7043',
    points: 50
  },
  monthStreak: {
    id: 'monthStreak',
    title: 'Monthly Master',
    description: 'Track expenses for 30 consecutive days',
    icon: TrophyIcon,
    color: '#7c4dff',
    points: 100
  },
  tenExpenses: {
    id: 'tenExpenses',
    title: 'Getting Started',
    description: 'Add 10 expenses',
    icon: TrendingUpIcon,
    color: '#26a69a',
    points: 25
  },
  fiftyExpenses: {
    id: 'fiftyExpenses',
    title: 'Dedicated Tracker',
    description: 'Add 50 expenses',
    icon: SavingsIcon,
    color: '#1976d2',
    points: 75
  },
  hundredExpenses: {
    id: 'hundredExpenses',
    title: 'Century Club',
    description: 'Add 100 expenses',
    icon: TrophyIcon,
    color: '#ffd600',
    points: 150
  },
  categories: {
    id: 'categories',
    title: 'Organized',
    description: 'Use 5 different categories',
    icon: CalendarIcon,
    color: '#8d6e63',
    points: 30
  },
  budgetMaster: {
    id: 'budgetMaster',
    title: 'Budget Master',
    description: 'Stay under budget for 3 consecutive months',
    icon: SavingsIcon,
    color: '#4caf50',
    points: 200
  },
  earlyBird: {
    id: 'earlyBird',
    title: 'Early Bird',
    description: 'Add expenses before 9 AM for 5 consecutive days',
    icon: StarIcon,
    color: '#ff9800',
    points: 40
  }
};

// Calculate achievements based on expenses
const calculateAchievements = (expenses) => {
  if (!expenses || expenses.length === 0) {
    return {
      unlocked: [],
      progress: {},
      totalPoints: 0,
      streak: 0,
      longestStreak: 0,
      streakMilestones: []
    };
  }

  const unlocked = [];
  const progress = {};
  let totalPoints = 0;
  let streak = 0;
  let longestStreak = 0;
  const streakMilestones = [7, 14, 30, 100];

  // First expense
  if (expenses.length >= 1) {
    unlocked.push('firstExpense');
    totalPoints += ACHIEVEMENTS.firstExpense.points;
  }

  // Expense count achievements
  if (expenses.length >= 10) {
    unlocked.push('tenExpenses');
    totalPoints += ACHIEVEMENTS.tenExpenses.points;
  }
  if (expenses.length >= 50) {
    unlocked.push('fiftyExpenses');
    totalPoints += ACHIEVEMENTS.fiftyExpenses.points;
  }
  if (expenses.length >= 100) {
    unlocked.push('hundredExpenses');
    totalPoints += ACHIEVEMENTS.hundredExpenses.points;
  }

  // Categories achievement
  const uniqueCategories = new Set(expenses.map(e => e.category));
  if (uniqueCategories.size >= 5) {
    unlocked.push('categories');
    totalPoints += ACHIEVEMENTS.categories.points;
  }

  // Calculate streak and longest streak
  const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  let currentStreak = 0;
  let currentDate = new Date(today);
  let tempStreak = 0;
  
  // Calculate current streak
  for (let i = 0; i < 30; i++) {
    const dateStr = currentDate.toISOString().split('T')[0];
    const hasExpenseOnDate = sortedExpenses.some(e => e.date === dateStr);
    
    if (hasExpenseOnDate) {
      currentStreak++;
    } else {
      break;
    }
    
    currentDate.setDate(currentDate.getDate() - 1);
  }
  
  // Calculate longest streak from all expenses
  const allDates = [...new Set(sortedExpenses.map(e => e.date))].sort().reverse();
  let maxStreak = 0;
  let tempMaxStreak = 0;
  
  for (let i = 0; i < allDates.length; i++) {
    const currentDate = new Date(allDates[i]);
    const nextDate = i < allDates.length - 1 ? new Date(allDates[i + 1]) : null;
    
    if (nextDate) {
      const dayDiff = Math.floor((currentDate - nextDate) / (1000 * 60 * 60 * 24));
      if (dayDiff === 1) {
        tempMaxStreak++;
      } else {
        maxStreak = Math.max(maxStreak, tempMaxStreak + 1);
        tempMaxStreak = 0;
      }
    } else {
      maxStreak = Math.max(maxStreak, tempMaxStreak + 1);
    }
  }
  
  streak = currentStreak;
  longestStreak = maxStreak;

  // Streak achievements
  if (streak >= 7) {
    unlocked.push('weekStreak');
    totalPoints += ACHIEVEMENTS.weekStreak.points;
  }
  if (streak >= 30) {
    unlocked.push('monthStreak');
    totalPoints += ACHIEVEMENTS.monthStreak.points;
  }

  // Calculate progress for each achievement
  Object.keys(ACHIEVEMENTS).forEach(achievementId => {
    const achievement = ACHIEVEMENTS[achievementId];
    let current = 0;
    let target = 1;

    switch (achievementId) {
      case 'firstExpense':
        current = expenses.length >= 1 ? 1 : 0;
        target = 1;
        break;
      case 'tenExpenses':
        current = Math.min(expenses.length, 10);
        target = 10;
        break;
      case 'fiftyExpenses':
        current = Math.min(expenses.length, 50);
        target = 50;
        break;
      case 'hundredExpenses':
        current = Math.min(expenses.length, 100);
        target = 100;
        break;
      case 'categories':
        current = Math.min(uniqueCategories.size, 5);
        target = 5;
        break;
      case 'weekStreak':
        current = Math.min(streak, 7);
        target = 7;
        break;
      case 'monthStreak':
        current = Math.min(streak, 30);
        target = 30;
        break;
      case 'budgetMaster':
        // Placeholder - would need budget data to implement
        current = 0;
        target = 3;
        break;
      case 'earlyBird':
        // Placeholder - would need timestamp data to implement
        current = 0;
        target = 5;
        break;
    }

    progress[achievementId] = { current, target, percentage: (current / target) * 100 };
  });

  return { unlocked, progress, totalPoints, streak, longestStreak, streakMilestones };
};

const Achievements = ({ expenses, user }) => {
  const [showAll, setShowAll] = useState(false);
  const [notification, setNotification] = useState({ open: false, achievement: null });
  const [showStreakAnimation, setShowStreakAnimation] = useState(false);
  const [showStreakCelebration, setShowStreakCelebration] = useState(false);
  const [celebrationStreak, setCelebrationStreak] = useState(0);
  const previousUnlocked = useRef([]);
  const previousStreak = useRef(0);
  const achievements = calculateAchievements(expenses);
  const { unlocked, progress, totalPoints, streak, longestStreak, streakMilestones } = achievements;

  const displayedAchievements = showAll 
    ? Object.keys(ACHIEVEMENTS) 
    : Object.keys(ACHIEVEMENTS).slice(0, 6);

  // Check for newly unlocked achievements
  useEffect(() => {
    const newlyUnlocked = unlocked.filter(id => !previousUnlocked.current.includes(id));
    if (newlyUnlocked.length > 0) {
      const achievement = ACHIEVEMENTS[newlyUnlocked[0]];
      setNotification({ open: true, achievement });
    }
    previousUnlocked.current = unlocked;
  }, [unlocked]);

  // Check for streak milestones
  useEffect(() => {
    const currentMilestone = streakMilestones.find(m => streak >= m);
    const previousMilestone = streakMilestones.find(m => previousStreak.current >= m);
    
    if (currentMilestone && currentMilestone !== previousMilestone) {
      setShowStreakAnimation(true);
      setShowStreakCelebration(true);
      setCelebrationStreak(streak);
      setTimeout(() => {
        setShowStreakAnimation(false);
        setShowStreakCelebration(false);
      }, 3000);
    }
    
    previousStreak.current = streak;
  }, [streak, streakMilestones]);

  const handleNotificationClose = () => {
    setNotification({ open: false, achievement: null });
  };

    return (
    <>
      <Paper elevation={0} sx={{ 
        p: 4, 
        borderRadius: 4, 
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.2)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #ffd600 0%, #ff9800 100%)'
        }
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Avatar sx={{ 
              width: 60, 
              height: 60, 
              background: 'linear-gradient(135deg, #ffd600 0%, #ff9800 100%)',
              boxShadow: '0 8px 32px rgba(255, 214, 0, 0.3)'
            }}>
              <TrophyIcon sx={{ fontSize: 30, color: 'white' }} />
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight={800} sx={{ mb: 0.5 }}>
                Achievements
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(0,0,0,0.6)', fontWeight: 300 }}>
                {unlocked.length} unlocked • {totalPoints} points
              </Typography>
            </Box>
          </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Tooltip title={`Longest streak: ${longestStreak} days`} arrow>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Zoom in={showStreakAnimation} timeout={500}>
                <Chip 
                  icon={<FireIcon />} 
                  label={`${streak} day streak`}
                  sx={{
                    background: streak >= 7 
                      ? 'linear-gradient(45deg, #ff7043 30%, #ff9800 90%)' 
                      : 'rgba(255,255,255,0.2)',
                    color: 'white',
                    fontWeight: 600,
                    animation: streak >= 7 ? 'pulse 2s infinite' : 'none',
                    '@keyframes pulse': {
                      '0%': { transform: 'scale(1)' },
                      '50%': { transform: 'scale(1.05)' },
                      '100%': { transform: 'scale(1)' }
                    },
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: '0 8px 32px rgba(255, 112, 67, 0.3)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                />
              </Zoom>
              {longestStreak > streak && (
                <Typography variant="body2" sx={{ color: 'rgba(0,0,0,0.6)', fontWeight: 500 }}>
                  (Best: {longestStreak})
                </Typography>
              )}
            </Box>
          </Tooltip>
          
          {/* Streak Progress */}
          {streak > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 150 }}>
              <Typography variant="body2" sx={{ color: 'rgba(0,0,0,0.6)', fontWeight: 500 }}>
                Next: {streakMilestones.find(m => m > streak) || 'Max'}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={Math.min((streak / (streakMilestones.find(m => m > streak) || streak)) * 100, 100)}
                sx={{ 
                  height: 6, 
                  borderRadius: 3, 
                  flex: 1,
                  bgcolor: 'rgba(0,0,0,0.1)',
                  '& .MuiLinearProgress-bar': {
                    background: 'linear-gradient(45deg, #ff7043 30%, #ff9800 90%)',
                    borderRadius: 3
                  }
                }}
              />
            </Box>
          )}
        </Box>
        </Box>

        <Grid container spacing={2}>
          {displayedAchievements.map((achievementId) => {
            const achievement = ACHIEVEMENTS[achievementId];
            const isUnlocked = unlocked.includes(achievementId);
            const progressData = progress[achievementId];
            const IconComponent = achievement.icon;

            return (
              <Grid item xs={12} sm={6} md={4} key={achievementId}>
                <Card 
                  elevation={isUnlocked ? 4 : 1}
                  sx={{ 
                    height: '100%',
                    transition: 'all 0.3s ease',
                    transform: isUnlocked ? 'scale(1.02)' : 'scale(1)',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: 6
                    }
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', p: 2 }}>
                    <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
                      <Avatar
                        sx={{
                          width: 56,
                          height: 56,
                          bgcolor: isUnlocked ? achievement.color : 'grey.300',
                          color: isUnlocked ? 'white' : 'grey.600',
                          fontSize: 28
                        }}
                      >
                        <IconComponent />
                      </Avatar>
                      {isUnlocked && (
                        <CheckCircleIcon 
                          sx={{ 
                            position: 'absolute', 
                            top: -5, 
                            right: -5, 
                            color: 'success.main',
                            fontSize: 20
                          }} 
                        />
                      )}
                    </Box>
                    
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      {achievement.title}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {achievement.description}
                    </Typography>

                    {!isUnlocked && progressData && (
                      <Box sx={{ mb: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="caption" color="text.secondary">
                            Progress
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {progressData.current}/{progressData.target}
                          </Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={progressData.percentage}
                          sx={{ height: 6, borderRadius: 3 }}
                        />
                      </Box>
                    )}

                                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }}>
                    <Chip
                      label={`${achievement.points} pts`}
                      size="small"
                      color={isUnlocked ? 'primary' : 'default'}
                      variant={isUnlocked ? 'filled' : 'outlined'}
                    />
                    
                    {/* Streak milestone badges for streak achievements */}
                    {(achievementId === 'weekStreak' || achievementId === 'monthStreak') && (
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        {streakMilestones.map((milestone) => (
                          <Tooltip key={milestone} title={`${milestone} day streak`} arrow>
                            <Box
                              sx={{
                                width: 12,
                                height: 12,
                                borderRadius: '50%',
                                bgcolor: streak >= milestone ? 'success.main' : 'grey.300',
                                border: '1px solid',
                                borderColor: streak >= milestone ? 'success.main' : 'grey.400'
                              }}
                            />
                          </Tooltip>
                        ))}
                      </Box>
                    )}
                  </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {Object.keys(ACHIEVEMENTS).length > 6 && (
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Button
              variant="outlined"
              onClick={() => setShowAll(!showAll)}
              sx={{ borderRadius: 2 }}
            >
              {showAll ? 'Show Less' : `Show All (${Object.keys(ACHIEVEMENTS).length})`}
            </Button>
          </Box>
        )}
      </Paper>
      
      <AchievementNotification
        open={notification.open}
        achievement={notification.achievement}
        onClose={handleNotificationClose}
      />
      
      <StreakCelebration
        open={showStreakCelebration}
        streak={celebrationStreak}
        onClose={() => setShowStreakCelebration(false)}
      />
    </>
  );
  };

export default Achievements; 