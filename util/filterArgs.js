const filterArgs = (args) => {
    const filter = {};
    for(let key in args) {
        if(args[key]) {
            filter[key] = args[key]
        }
    }
    return filter;
}

module.exports = filterArgs;