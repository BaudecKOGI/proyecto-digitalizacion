// NOTE: A tracking system such as Sentry should replace the console

export const LogLevel = { NONE: "NONE", ERROR: "ERROR", WARN: "WARN", DEBUG: "DEBUG", ALL: "ALL" };

const LogLevelNumber = { NONE: 0, ERROR: 1, WARN: 2, DEBUG: 3, ALL: 4 };

export class Logger {
	constructor({ prefix = "", level = LogLevel.ALL, showLevel = true }) {
		this.prefix = prefix;
		this.level = level;
		this.levelNumber = LogLevelNumber[this.level];
		this.showLevel = showLevel;
	}

	debug = (...args) => {
		if (this.canWrite(LogLevel.DEBUG)) {
			this.write(LogLevel.DEBUG, ...args);
		}
	};

	warn = (...args) => {
		if (this.canWrite(LogLevel.WARN)) {
			this.write(LogLevel.WARN, ...args);
		}
	};

	error = (...args) => {
		if (this.canWrite(LogLevel.ERROR)) {
			this.write(LogLevel.ERROR, ...args);
		}
	};

	canWrite(level) {
		return this.levelNumber >= LogLevelNumber[level];
	}

	write(level, ...args) {
		let prefix = this.prefix;

		if (this.showLevel) {
			prefix = `- ${level} ${prefix}`;
		}

		if (level === LogLevel.ERROR) {
			console.error(prefix, ...args);
		} else {
			console.log(prefix, ...args);
		}
	}
}

export function createLogger({ prefix, level } = {}) {
	return new Logger({ prefix, level });
}
