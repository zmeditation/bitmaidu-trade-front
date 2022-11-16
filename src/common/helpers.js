export const currencySign = currency => {
    switch (currency) {
        case 'USD': return '$'
        case 'EUR': return '€'
        case 'GBP': return '£'
        case 'JPY': return '¥'
        case 'RUB': return '₽'
        case 'ILS': return '₪'
        case 'AUD': return '₳'
        case 'THB': return '฿'
        default: return currency+' '
    }
}

export const timeToString = time => {
    let stamp = time,
        date = new Date(stamp)

    return ('00' + date.getUTCDate()).slice(-2) + '.' +
        ('00' + (date.getUTCMonth()+1)).slice(-2) + '.' +
        date.getUTCFullYear() + ' ' +
        ('00' + date.getUTCHours()).slice(-2) + ':' +
        ('00' + date.getUTCMinutes()).slice(-2) + ':' +
        ('00' + date.getUTCSeconds()).slice(-2)
}

export const findLevel = (price, orderbook, side, low, high) => {
    if (!orderbook.length || (side === 'asks' && price < orderbook[0][0]) || (side === 'bids' && price > orderbook[0][0])) {
        return 0
    }

    if ((side === 'asks' && price > orderbook[orderbook.length-1][0]) || (side === 'bids' && price < orderbook[orderbook.length-1][0])) {
        return orderbook.length
    }

    if (!low) {
        low = 0
    }

    if (!high) {
        high = orderbook.length-1
    }

    let index = low + Math.floor((high - low) / 2)

    if (orderbook[index][0] === price) {
        return index
    }

    if (high - low <= 1) {
        return index+1
    }

    if ((side === 'asks' && price < orderbook[index][0]) || (side === 'bids' && price > orderbook[index][0])) {
        high = index
        return findLevel(price, orderbook, side, low, high)
    }

    if ((side === 'asks' && price > orderbook[index][0]) || (side === 'bids' && price < orderbook[index][0])) {
        low = index
        return findLevel(price, orderbook, side, low, high)
    }
}
