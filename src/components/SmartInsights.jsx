import React, { useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Alert,
  Divider,
  LinearProgress,
  Card,
  CardContent,
  Grid,
  Avatar,
  Fade
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Lightbulb as LightbulbIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Savings as SavingsIcon,
  Restaurant as FoodIcon,
  LocalShipping as TransportIcon,
  ShoppingCart as ShoppingIcon,
  Movie as EntertainmentIcon,
  LocalHospital as HealthcareIcon
} from '@mui/icons-material';

const SmartInsights = ({ expenses, categories = [] }) => {
  const insights = useMemo(() => {
    if (!expenses || expenses.length === 0) {
      return {
        insights: [],
        spendingTrends: {},
        recommendations: []
      };
    }

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    // Filter expenses by month
    const currentMonthExpenses = expenses.filter(e => {
      const date = new Date(e.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });

    const lastMonthExpenses = expenses.filter(e => {
      const date = new Date(e.date);
      return date.getMonth() === lastMonth && date.getFullYear() === lastYear;
    });

    // Calculate spending by category
    const getCategorySpending = (expenseList) => {
      const spending = {};
      expenseList.forEach(e => {
        spending[e.category] = (spending[e.category] || 0) + Number(e.amount);
      });
      return spending;
    };

    const currentSpending = getCategorySpending(currentMonthExpenses);
    const lastSpending = getCategorySpending(lastMonthExpenses);

    // Calculate trends
    const trends = {};
    Object.keys(currentSpending).forEach(category => {
      const current = currentSpending[category];
      const last = lastSpending[category] || 0;
      const change = last > 0 ? ((current - last) / last) * 100 : 0;
      trends[category] = { current, last, change };
    });

    // Generate insights
    const insights = [];
    const recommendations = [];

    // High spending categories
    const highSpendingCategories = Object.entries(currentSpending)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3);

    highSpendingCategories.forEach(([category, amount]) => {
      const trend = trends[category];
      if (trend.change > 20) {
        insights.push({
          type: 'warning',
          icon: TrendingUpIcon,
          title: `High spending in ${category}`,
          message: `You spent ₹${amount.toLocaleString('en-IN')} on ${category} this month, ${Math.abs(trend.change).toFixed(1)}% more than last month.`,
          amount: amount,
          change: trend.change
        });
        
        recommendations.push({
          type: 'savings',
          icon: SavingsIcon,
          title: `Reduce ${category} spending`,
          message: `Consider setting a budget for ${category} or look for cheaper alternatives.`,
          potential: Math.round(amount * 0.2)
        });
      }
    });

    // Positive trends
    Object.entries(trends).forEach(([category, trend]) => {
      if (trend.change < -10 && trend.current > 0) {
        insights.push({
          type: 'success',
          icon: TrendingDownIcon,
          title: `Great job on ${category}!`,
          message: `You reduced ${category} spending by ${Math.abs(trend.change).toFixed(1)}% compared to last month.`,
          amount: trend.current,
          change: trend.change
        });
      }
    });

    // Spending patterns
    const totalCurrent = Object.values(currentSpending).reduce((sum, val) => sum + val, 0);
    const totalLast = Object.values(lastSpending).reduce((sum, val) => sum + val, 0);
    const totalChange = totalLast > 0 ? ((totalCurrent - totalLast) / totalLast) * 100 : 0;

    if (totalChange > 15) {
      insights.push({
        type: 'warning',
        icon: WarningIcon,
        title: 'Overall spending increased',
        message: `Your total spending increased by ${totalChange.toFixed(1)}% this month.`,
        amount: totalCurrent,
        change: totalChange
      });
    } else if (totalChange < -10) {
      insights.push({
        type: 'success',
        icon: CheckCircleIcon,
        title: 'Great spending control!',
        message: `You reduced your total spending by ${Math.abs(totalChange).toFixed(1)}% this month.`,
        amount: totalCurrent,
        change: totalChange
      });
    }

    // Category-specific recommendations
    const categoryIcons = {
      'Food': FoodIcon,
      'Transport': TransportIcon,
      'Shopping': ShoppingIcon,
      'Entertainment': EntertainmentIcon,
      'Healthcare': HealthcareIcon
    };

    Object.entries(currentSpending).forEach(([category, amount]) => {
      if (amount > 5000) {
        const IconComponent = categoryIcons[category] || SavingsIcon;
        recommendations.push({
          type: 'category',
          icon: IconComponent,
          title: `Optimize ${category} spending`,
          message: `You spent ₹${amount.toLocaleString('en-IN')} on ${category}. Consider reviewing your ${category.toLowerCase()} expenses.`,
          potential: Math.round(amount * 0.15)
        });
      }
    });

    // Subscription recommendations
    const recurringExpenses = expenses
      .filter(e => e.description.toLowerCase().includes('subscription') || 
                   e.description.toLowerCase().includes('monthly') ||
                   e.description.toLowerCase().includes('netflix') ||
                   e.description.toLowerCase().includes('spotify'))
      .reduce((acc, e) => {
        const key = e.description.toLowerCase();
        if (!acc[key]) {
          acc[key] = { ...e, count: 1 };
        } else {
          acc[key].count++;
          acc[key].amount += Number(e.amount);
        }
        return acc;
      }, {});

    Object.values(recurringExpenses).forEach(expense => {
      if (expense.count >= 2) {
        recommendations.push({
          type: 'subscription',
          icon: LightbulbIcon,
          title: 'Recurring expense detected',
          message: `${expense.description} appears ${expense.count} times. Consider if you need this subscription.`,
          potential: Math.round(expense.amount / expense.count)
        });
      }
    });

    return {
      insights,
      trends,
      recommendations: recommendations.slice(0, 5) // Limit to top 5 recommendations
    };
  }, [expenses, categories]);

  if (!expenses || expenses.length === 0) {
    return (
      <Paper elevation={3} sx={{ p: 3, borderRadius: 3, bgcolor: 'white' }}>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          Smart Insights
        </Typography>
        <Alert severity="info">
          Add more expenses to get personalized insights and recommendations.
        </Alert>
      </Paper>
    );
  }

  return (
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
        background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)'
      }
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
        <Avatar sx={{ 
          width: 60, 
          height: 60, 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)'
        }}>
          <LightbulbIcon sx={{ fontSize: 30, color: 'white' }} />
        </Avatar>
        <Box>
          <Typography variant="h5" fontWeight={800} sx={{ mb: 0.5 }}>
            Smart Insights
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(0,0,0,0.6)', fontWeight: 300 }}>
            AI-powered analysis of your spending patterns
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={4}>
        {/* Insights */}
        <Grid item xs={12} lg={6}>
          <Card sx={{ 
            borderRadius: 3,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <CardContent sx={{ p: 3, position: 'relative', zIndex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <TrendingUpIcon sx={{ fontSize: 28 }} />
                <Typography variant="h6" fontWeight={700}>
                  Spending Insights
                </Typography>
              </Box>
              
              {insights.insights.length === 0 ? (
                <Alert severity="success" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}>
                  Your spending looks healthy this month!
                </Alert>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {insights.insights.map((insight, index) => {
                    const IconComponent = insight.icon;
                    return (
                      <Fade in timeout={800 + index * 100} key={index}>
                        <Box sx={{ 
                          p: 2, 
                          borderRadius: 2, 
                          background: 'rgba(255,255,255,0.1)',
                          border: '1px solid rgba(255,255,255,0.2)'
                        }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                            <IconComponent sx={{ fontSize: 20 }} />
                            <Typography variant="subtitle2" fontWeight={600}>
                              {insight.title}
                            </Typography>
                            <Chip
                              label={`${insight.change > 0 ? '+' : ''}${insight.change.toFixed(1)}%`}
                              size="small"
                              sx={{ 
                                bgcolor: insight.change > 0 ? 'rgba(255,193,7,0.2)' : 'rgba(76,175,80,0.2)',
                                color: insight.change > 0 ? '#ffc107' : '#4caf50',
                                fontWeight: 600
                              }}
                            />
                          </Box>
                          <Typography variant="body2" sx={{ opacity: 0.9 }}>
                            {insight.message}
                          </Typography>
                        </Box>
                      </Fade>
                    );
                  })}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Recommendations */}
        <Grid item xs={12} lg={6}>
          <Card sx={{ 
            borderRadius: 3,
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <CardContent sx={{ p: 3, position: 'relative', zIndex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <LightbulbIcon sx={{ fontSize: 28 }} />
                <Typography variant="h6" fontWeight={700}>
                  Smart Recommendations
                </Typography>
              </Box>
              
              {insights.recommendations.length === 0 ? (
                <Alert severity="success" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}>
                  No specific recommendations at this time.
                </Alert>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {insights.recommendations.map((rec, index) => {
                    const IconComponent = rec.icon;
                    return (
                      <Fade in timeout={800 + index * 100} key={index}>
                        <Box sx={{ 
                          p: 2, 
                          borderRadius: 2, 
                          background: 'rgba(255,255,255,0.1)',
                          border: '1px solid rgba(255,255,255,0.2)'
                        }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                            <IconComponent sx={{ fontSize: 20 }} />
                            <Typography variant="subtitle2" fontWeight={600}>
                              {rec.title}
                            </Typography>
                            {rec.potential && (
                              <Chip
                                label={`Save ₹${rec.potential}`}
                                size="small"
                                sx={{ 
                                  bgcolor: 'rgba(76,175,80,0.2)',
                                  color: '#4caf50',
                                  fontWeight: 600
                                }}
                              />
                            )}
                          </Box>
                          <Typography variant="body2" sx={{ opacity: 0.9 }}>
                            {rec.message}
                          </Typography>
                        </Box>
                      </Fade>
                    );
                  })}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Spending Trends Chart */}
      {Object.keys(insights.trends).length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" fontWeight={700} gutterBottom sx={{ mb: 3 }}>
            Category Spending Trends
          </Typography>
          <Grid container spacing={3}>
            {Object.entries(insights.trends).map(([category, trend], index) => (
              <Grid item xs={12} sm={6} md={4} key={category}>
                <Fade in timeout={1000 + index * 100}>
                  <Card sx={{ 
                    borderRadius: 3,
                    background: 'rgba(255,255,255,0.95)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.15)'
                    }
                  }}>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" fontWeight={700} color="primary">
                          {category}
                        </Typography>
                        <Chip
                          label={`${trend.change > 0 ? '+' : ''}${trend.change.toFixed(1)}%`}
                          size="small"
                          sx={{ 
                            bgcolor: trend.change > 0 ? 'rgba(255,193,7,0.2)' : 'rgba(76,175,80,0.2)',
                            color: trend.change > 0 ? '#ff9800' : '#4caf50',
                            fontWeight: 600
                          }}
                        />
                      </Box>
                      <Typography variant="h4" fontWeight={800} sx={{ mb: 1 }}>
                        ₹{trend.current.toLocaleString('en-IN')}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(0,0,0,0.6)' }}>
                        vs ₹{trend.last.toLocaleString('en-IN')} last month
                      </Typography>
                      
                      {/* Progress Bar */}
                      <Box sx={{ mt: 2 }}>
                        <LinearProgress
                          variant="determinate"
                          value={Math.min((trend.current / (trend.last || trend.current)) * 100, 200)}
                          sx={{ 
                            height: 6, 
                            borderRadius: 3,
                            bgcolor: 'rgba(0,0,0,0.1)',
                            '& .MuiLinearProgress-bar': {
                              background: trend.change > 0 
                                ? 'linear-gradient(90deg, #ff9800 0%, #ff5722 100%)'
                                : 'linear-gradient(90deg, #4caf50 0%, #8bc34a 100%)',
                              borderRadius: 3
                            }
                          }}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Paper>
  );
};

export default SmartInsights; 