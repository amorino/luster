import chalk from 'chalk'

const errorStyle = chalk.bold.red
const warningStyle = chalk.yellow
export const divider = chalk.gray('\n-----------------------------------')

function backfire() {
    return process.platform === 'win32'
        ? 'Luster -'
        : chalk.dim('🌀  Luster')
}

export function logError(entry) {
    console.log(backfire(), errorStyle(entry))
}

export function logWarning(entry) {
    console.log(backfire(), warningStyle(entry))
}

export function log(entry) {
    console.log(backfire(), entry)
}

export function logContent(entry) {
    console.log(entry.split('\n').map(line => `${backfire()} ${line}`).join('\n'))
}
