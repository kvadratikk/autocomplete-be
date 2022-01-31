module.exports = {
    createAutoComplete: function (data) {
        const cache = {};

        return function (sub) {
            if (cache[sub]) return cache[sub];
            if (!sub) return [];

            const res = [];

            const subLC = sub.toLowerCase();
            const dataLength = data.length;

            let low = 0;
            let high = dataLength - 1;

            while (high >= low) {
                const mid = Math.floor((low + high) / 2);

                if (data[mid].toLowerCase().startsWith(subLC) &&
                    ((data[mid - 1] &&
                        !data[mid - 1].toLowerCase().startsWith(subLC)) ||
                        !data[mid - 1])) {
                    for (let i = mid; data[i] && data[i].toLowerCase().startsWith(subLC); i++) {
                        res.push(data[i]);
                    }

                    cache[sub] = res;
                }

                if (data[mid] < sub) {
                    low = mid + 1;
                } else {
                    high = mid - 1;
                }
            }

            return res;
        };
    }
}
