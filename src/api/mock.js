export var users = [
    { name: 'Egor', email: 'egor@evas-php.com', type: 1, role: 'front' },
    { name: 'John', email: 'john_doe@example.com', referer_id: 1 },
]

users.forEach((user, i) => {
    user.id = i + 1
})
