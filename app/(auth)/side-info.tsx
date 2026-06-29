import { Box, Typography, Divider, Grid } from '@mui/material';
import { ShoppingBag, Lock, Timeline, LocalShipping } from '@mui/icons-material';
import styles from './side-info.module.css';
import MainLogo from '@/components/main-logo';

export default () => {
  const features = [
    {
      icon: ShoppingBag,
      title: 'Curated Collection',
      description: 'Handpicked fashion from top brands',
    },
    {
      icon: Timeline,
      title: 'Fast Checkout',
      description: 'Complete your purchase in seconds',
    },
    {
      icon: Lock,
      title: 'Secure Payment',
      description: 'Your data is always protected',
    },
    {
      icon: LocalShipping,
      title: 'Free Shipping',
      description: 'On orders over $50',
    },
  ];

  return (
    <Box className={styles.mainContainer}>
      {/* Logo Section */}
      <Box className={styles.logoContainer}>
        <MainLogo className={styles.logo} />
        <Typography className={styles.logoText} variant="h4">
          StyleStreet
        </Typography>
      </Box>

      {/* Tagline */}
      <Typography className={styles.tagline} variant="body1">
        Your go-to destination for premium fashion
      </Typography>

      <Divider className={styles.divider} />

      {/* Features Grid */}
      <Grid container className={styles.featuresContainer} spacing={4}>
        {features.map((feature, index) => {
          const IconComponent = feature.icon;
          return (
            <Grid key={index} className={styles.featureCard} size={6}>
              <Box className={styles.iconWrapper}>
                <IconComponent className={styles.featureIcon} />
              </Box>
              <Box>
                <Typography className={styles.featureTitle} variant="subtitle2">
                  {feature.title}
                </Typography>
                <Typography className={styles.featureDescription} variant="caption">
                  {feature.description}
                </Typography>
              </Box>
            </Grid>
          );
        })}
      </Grid>

      <Divider className={styles.divider} />

      {/* Trust Section */}
      <Box className={styles.trustSection}>
        <Typography className={styles.trustTitle} variant="subtitle2">
          Trusted by 100k+ Customers
        </Typography>
        <Box className={styles.statsContainer}>
          <Box className={styles.statBox}>
            <Typography className={styles.statNumber} variant="h6">
              4.8★
            </Typography>
            <Typography className={styles.statLabel} variant="caption">
              Rating
            </Typography>
          </Box>
          <Box className={styles.statBox}>
            <Typography className={styles.statNumber} variant="h6">
              24/7
            </Typography>
            <Typography className={styles.statLabel} variant="caption">
              Support
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Bottom CTA */}
      <Box className={styles.ctaSection}>
        <Typography className={styles.ctaText} variant="body2">
          New to StyleStreet? Create an account to unlock exclusive deals and rewards.
        </Typography>
      </Box>
    </Box>
  );
};
