/**
 * Structured Logger for WhichNotes
 *
 * Provides consistent logging across the application with:
 * - Pretty console logs in development
 * - Structured JSON logs in production
 * - Log levels (debug, info, warn, error)
 * - Context support
 */

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogContext {
  [key: string]: any;
}

class Logger {
  private isDevelopment: boolean;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === "development";
  }

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();

    if (this.isDevelopment) {
      // Pretty console logs for development
      const emoji = {
        debug: "🔍",
        info: "ℹ️",
        warn: "⚠️",
        error: "❌",
      }[level];

      let output = `${emoji} [${timestamp}] ${level.toUpperCase()}: ${message}`;

      if (context && Object.keys(context).length > 0) {
        output += `\n  Context: ${JSON.stringify(context, null, 2)}`;
      }

      return output;
    } else {
      // Structured JSON logs for production
      return JSON.stringify({
        timestamp,
        level,
        message,
        ...context,
      });
    }
  }

  debug(message: string, context?: LogContext) {
    if (this.isDevelopment) {
      console.debug(this.formatMessage("debug", message, context));
    }
  }

  info(message: string, context?: LogContext) {
    console.info(this.formatMessage("info", message, context));
  }

  warn(message: string, context?: LogContext) {
    console.warn(this.formatMessage("warn", message, context));
  }

  error(message: string, error?: Error | unknown, context?: LogContext) {
    const errorContext = {
      ...context,
      ...(error instanceof Error && {
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack,
        },
      }),
    };

    console.error(this.formatMessage("error", message, errorContext));
  }

  // Request logging helper
  logRequest(method: string, path: string, context?: LogContext) {
    this.info(`${method} ${path}`, {
      type: "request",
      method,
      path,
      ...context,
    });
  }

  // Response logging helper
  logResponse(
    method: string,
    path: string,
    status: number,
    duration?: number,
    context?: LogContext
  ) {
    const level = status >= 500 ? "error" : status >= 400 ? "warn" : "info";

    this[level](`${method} ${path} - ${status}`, {
      type: "response",
      method,
      path,
      status,
      duration,
      ...context,
    });
  }

  // Database query logging
  logQuery(query: string, duration?: number, context?: LogContext) {
    this.debug("Database query", {
      type: "database",
      query: query.substring(0, 200), // Truncate long queries
      duration,
      ...context,
    });
  }

  // AI operation logging
  logAI(operation: string, model: string, duration?: number, context?: LogContext) {
    this.info(`AI: ${operation}`, {
      type: "ai",
      operation,
      model,
      duration,
      ...context,
    });
  }
}

// Export singleton instance
export const logger = new Logger();

// Export for testing
export { Logger };
