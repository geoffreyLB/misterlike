const config = require('./config')
const options = require('./options')
const logger = require('./logger')

module.exports = async page => {
    logger.info("Go to MisterTemp' page...")

    await page.goto(`${config.url}/company/mistertemp/`)

    logger.info('Waiting for articles...')

    const feed = await page.waitForSelector('#organization-feed')
    await feed.hover()

    for (let i = 1; await page.$('#organization-feed .loading'); i++) {
        const article = await page.waitForSelector('#organization-feed .feed-shared-update')
        await article.hover()

        const button = await article.$('.feed-shared-social-action-bar .like-button')
        await button.hover()
    
        const liked = await page.evaluate(node => node.classList.contains('active'), button)

        if (!liked) {
            logger.info(`Like article n°${i}...`)
            button.click({ delay: 20 })
        } else if (!options.all) {
            break
        }

        await page.evaluate(node => node.remove(), article)
        await page.waitFor(config.sleep)
        await page.evaluate(() => window.scrollBy({ top: '-20' }))
        await page.waitFor(100)
        await page.evaluate(() => window.scrollBy({ top: '20' }))
    }
}