
export class Group
{
    type = 'group'
    name
    items
    // selectedIndex

    constructor(name, items) {
        if (arguments < 2 || 'object' === typeof name) {
            items = name
            name = null
        }
        this.name = name
        this.setItems(items)
    }
    setItems(items) {
        this.items = items
    }
    fillItems(items, cb) {
        this.items = {}
        if (items) Object.entries(items).forEach(([key, item]) => {
            this.items[key] = cb(key, item)
        })
    }
    setItemsInBlock(items) {
        this.fillItems(items, (key, item) => {
            // if (Array.isArray(item) || ('object' === typeof item && !(item instanceof Group))) {
            //     // просто набор полей, если это массив или объект
            //     item = (new Block(key, item)).setRegular()
            // }
            if (Array.isArray(item) || ('object' === typeof item && !(item instanceof Group))) {
                // превращаем блок, если поля объединены в массив или объект
                item = new Block(key, item)
            }
            if (item instanceof Group && !item.name) {
                // устанавливаем ключ как имя, если не указано
                item.name = key
            }
            return item
        })
    }
    next(names, cb) {
        console.log('next', names, this)
        if (!names || !names.length) {
            if (cb) cb(this)
            return this.items
            // return this instanceof Tabs ? this.selected?.items : this.items
            // return this instanceof Tabs ? this.selected?.items : this.items
        }
        const next = names.shift()
        const group = Object.values(this.items).find(item => item.name == next)
        console.log(next, group)
        // return names.length ? group.next(names) : group
        console.log('end next', next, group)
        if (cb) cb(group)
        return group ? group.next(names) : group
    }
}

export class Tabs extends Group
{
    type = 'tabs'
    // selectedIndex
    
    get selected() {
        // return this.items.find(item => item.name == this.selectedIndex)
        return this.items[this.selectedIndex] ?? null
    }
    setItems(items) {
        let selected = undefined
        this.fillItems(items, (key, item) => {
            // console.warn(key, item)
            if (!(item instanceof Tab)) {
                // превращаем в Tab
                item = new Tab(key, item)
            }
            if (item instanceof Group && !item.name) {
                // устанавливаем ключ как имя, если не указано
                item.name = key
            }
            item.parent = this
            if (selected === undefined) {
                // предвыбранный таб
                // this.selectedIndex = key
                // console.error('asdassad', selected)
                selected = key
                // this.selectedIndex = 'general'
            }
            return item
        })
        this.selectTab(selected)
    }

    selectTab(name) {
        // if (!this.items[name]) return;
        if (this.selected) this.selected.selected = false
        this.selectedIndex = name
        if (this.selected) this.selected.selected = true
    }
}

class Tab extends Group
{
    type = 'tab'
    // selected = false
    setItems(items) {
        this.setItemsInBlock(items)
    }
    select() {
        this.parent.selectTab(this.name)
    }
}

export class Block extends Group
{
    type = 'block'
    // regular = false
    setItems(items) {
        this.setItemsInBlock(items)
    }
    // setRegular(value = true) {
    //     this.regular = value
    // }
}
