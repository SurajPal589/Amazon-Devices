import React, { Component, ErrorInfo, ReactNode } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { TV_COLORS, TV_TYPOGRAPHY } from '../../styles/tvTokens';
import { FocusableButton } from './FocusableButton';
import { logger } from '../../services/logger';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
  countdown: number;
}

export class KioskErrorBoundary extends Component<Props, State> {
  private timer: NodeJS.Timeout | null = null;

  public state: State = {
    hasError: false,
    errorMessage: '',
    countdown: 10,
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, errorMessage: error.message || 'Unknown runtime error' };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    logger.error('KioskErrorBoundary', `Uncaught render error: ${error.message}`, errorInfo);

    // Auto-recovery countdown
    this.timer = setInterval(() => {
      this.setState((prev) => {
        if (prev.countdown <= 1) {
          if (this.timer) clearInterval(this.timer);
          this.handleReload();
          return { countdown: 0 };
        }
        return { countdown: prev.countdown - 1 };
      });
    }, 1000);
  }

  public componentWillUnmount(): void {
    if (this.timer) clearInterval(this.timer);
  }

  private handleReload = (): void => {
    this.setState({ hasError: false, errorMessage: '', countdown: 10 });
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <View style={styles.card}>
            <Text style={styles.errorIcon}>⚠️</Text>
            <Text style={styles.title}>Kiosk Display Recovery Mode</Text>
            <Text style={styles.message}>
              An unexpected render issue occurred. The kiosk self-healing subsystem has engaged.
            </Text>
            <Text style={styles.details}>Details: {this.state.errorMessage}</Text>
            <Text style={styles.timerText}>
              Automatic restart in {this.state.countdown} seconds...
            </Text>
            <FocusableButton
              label="Reload Immediately"
              onPress={this.handleReload}
              isPrimary={true}
              style={styles.button}
            />
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: TV_COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  card: {
    width: 680,
    backgroundColor: TV_COLORS.cardBackground,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: TV_COLORS.alertWarning,
    padding: 32,
    alignItems: 'center',
  },
  errorIcon: {
    fontSize: 56,
    marginBottom: 16,
  },
  title: {
    ...TV_TYPOGRAPHY.titleSection,
    color: TV_COLORS.textPrimary,
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    ...TV_TYPOGRAPHY.bodyRegular,
    color: TV_COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  details: {
    ...TV_TYPOGRAPHY.caption,
    color: TV_COLORS.textMuted,
    backgroundColor: TV_COLORS.cardSurface,
    padding: 10,
    borderRadius: 6,
    marginBottom: 20,
    width: '100%',
    textAlign: 'center',
  },
  timerText: {
    ...TV_TYPOGRAPHY.bodySecondary,
    color: TV_COLORS.accentPrimary,
    fontWeight: '700',
    marginBottom: 20,
  },
  button: {
    minWidth: 220,
  },
});
