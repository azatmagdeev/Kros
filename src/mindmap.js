// принцип сохранения такой:
// search[0] = id model;
// сортировка компонентов по id
//search[1] = component with id=1
//search[2] = component with id=2

/** */



const leather = {
    name: 'Кожа',
    url: '../results/textures/red-leather-test2.jpg',
    textures: [
        {
            id: '1',
            name: 'Желтый',
            url: '../textures/test/test-yellow-leather.jpg'
        },
        {
            id: '2',
            name: 'Красный',
            url: '../textures/test/test-red-leather.jpg',
        },
        {
            id: '3',
            name: 'Черный',
            url: '../results/textures/leather-texutre.jpg'
        },
    ]
};
const nubuck = {
    name: 'Нубук',
    url: '../sneakers_constructor/textures/approved/nubuck/beige_nubuck.jpg',
    textures: [
        {
            id: '4',
            name: 'Бежевый',
            url: '../textures/unwrapped/nubuck/biege-nubuck-unwrapped-min.jpg'
        },
        {
            id: '5',
            name: 'Черный',
            url: '../textures/unwrapped/nubuck/black-nubuck-unwrapped-min.jpg'
        },
        {
            id: '6',
            name: 'Синий',
            url: '../textures/unwrapped/nubuck/blue-nubuck-unwrapped-min.jpg'
        },
        {
            id: '7',
            name: 'Коричневый',
            url: '../textures/unwrapped/nubuck/brown-nubuck-unwrapped-min.jpg'
        },
        {
            id: '8',
            name: 'Кирпич',
            url: '../textures/unwrapped/nubuck/brick-nubuck-unwrapped-min.jpg'
        },
    ]
};
const jeans = {
    name: 'Джинс',
    url: '../results/textures/jeans-test2.jpg',
    textures: [
        {
            id: '9',
            name: 'Синий',
            url: '../textures/test/test-blue-jeans.jpg',
        },
        {
            id: 'a',
            name: 'Коттон',
            url: '../textures/test/test-cotton.jpg'
        }
    ]
};
const innerTextures = [
    {
        name: 'Джинс',
        url: '../results/textures/jeans-test2.jpg'
    },
    {
        name: 'Красная',
        url: '../results/textures/red-leather-test2.jpg'
    },
    {
        name: 'Орех',
        url: ''
    },
    {
        name: 'Песок',
        url: ''
    },
    {
        name: 'Графит',
        url: ''
    },
    {
        name: 'Белая',
        url: ''
    },
    {
        name: 'Черная',
        url: '../results/textures/leather-texutre.jpg'
    },
];

const backComponent = {
    name: 'Задник',
    id: 6,
    url: '../results/components/Component-back.png',
    mesh_name: '1',
    textures: [
        leather
    ]
}

const lacesComponent = {
    name: 'Шнурки',
    id: 7,
    url: '../results/components/Component-laces.png',
    mesh_name: '5',
    textures: [
        leather
    ]
}


const mindMap = [
    {
        name: 'Канзас',
        id: '1',
        // obj_url:'../sneakers_constructor/results/sneakers_lower_quality_with_tag.glb',
        obj_url: '../models/unwrapped version/sneakers-unwrapped-usual.gltf',
        components: [
            {
                id: 1,
                name: 'Основа',
                url: '../results/components/Component-body.png',
                mesh_name: ['7', '6,5'],
                textures: [
                    leather,
                    nubuck,
                    jeans,
                ]
            },
            {
                id: 2,
                name: 'Подкладка',
                url: '../results/components/Component-inside.png',
                mesh_name: '2',
                textures: innerTextures
            },
            {
                id: 3,
                name: 'Подошва',
                url: '../results/components/Component-sole.png',
                mesh_name: [
                    'Cube.003_0',
                    'Cube.003_1',
                    // 'Cube.001_2',
                ],
                textures: [
                    {
                        name: 'Черная',
                        url: '../results/textures/texture4.jpg',
                        urls: {
                            'Cube.003_0': '../results/textures/texture4.jpg',
                            'Cube.003_1': '../results/textures/texture2.jpg',
                            // 'Cube.001_2':'../results/textures/texture2.jpg',
                        }
                    },
                    {
                        name: 'Белая',
                        url: '../results/textures/white_rubber.png',
                        urls: {
                            'Cube.003_0': '../results/textures/white_rubber.png',
                            'Cube.003_1': '../results/textures/white_dotted_rubber.png',
                            // 'Cube.001_2':'../results/textures/texture5.png',
                        }
                    },
                ],
            },
            {
                id: 4,
                name: 'Подблочник',
                url: '../results/components/Component-podblock.png',
                mesh_name: '6',
                textures: [
                    leather,
                    nubuck,
                    jeans,
                ]
            },
            {
                id: 5,
                name: 'Лэйбл',
                url: '../results/components/Component-label.png',
                mesh_name: '4'
            },
            backComponent,
            lacesComponent,
        ]
    },
    {
        name: 'Техас',
        id: '2',
        // obj_url:'../sneakers_constructor/results/sneakers_high_sole_with_tag.glb',
        obj_url: '../models/unwrapped version/sneakers-unwrapped-high-sole.gltf',
        components: [
            {
                name: 'Основа',
                url: '../results/components/Component-body.png',
                mesh_name: ['7', '6,5'],
                textures: [
                    leather,
                    nubuck,
                    jeans,
                ]
            },
            {
                name: 'Подкладка',
                url: '../results/components/Component-inside.png',
                mesh_name: '2',
                textures: [
                    {
                        name: 'Джинс',
                        url: '../results/textures/jeans-test2.jpg'
                    },
                    {
                        name: 'Красная',
                        url: '../results/textures/red-leather-test2.jpg'
                    },
                    {
                        name: 'Орех',
                        url: ''
                    },
                    {
                        name: 'Песок',
                        url: ''
                    },
                    {
                        name: 'Графит',
                        url: ''
                    },
                    {
                        name: 'Белая',
                        url: ''
                    },
                    {
                        name: 'Черная',
                        url: '../results/textures/leather-texutre.jpg'
                    },
                ]
            },
            {
                name: 'Подблочник',
                url: '../results/components/Component-podblock.png',
                mesh_name: '6',
                textures: [
                    leather,
                    nubuck,
                    jeans,
                ]
            },
            {
                name: 'Лэйбл',
                url: '../results/components/Component-label.png',
                mesh_name: '4'
            },
        ]
    },
    {
        name: 'Монтана',
        id: '3',
        // obj_url:'../sneakers_constructor/results/sneakers-with-nose-and-tag.glb',
        obj_url: '../models/unwrapped version/sneakers-unwrapped-with-nose.gltf',
        components: [
            {
                name: 'Основа',
                url: '../results/components/Component-body.png',
                mesh_name: '7',
                textures: [
                    leather,
                    nubuck,
                    jeans,
                ]
            },
            {
                name: 'Подкладка',
                url: '../results/components/Component-inside.png',
                mesh_name: '2',
                textures: [
                    {
                        name: 'Джинс',
                        url: '../results/textures/jeans-test2.jpg'
                    },
                    {
                        name: 'Красная',
                        url: '../results/textures/red-leather-test2.jpg'
                    },
                    {
                        name: 'Орех',
                        url: ''
                    },
                    {
                        name: 'Песок',
                        url: ''
                    },
                    {
                        name: 'Графит',
                        url: ''
                    },
                    {
                        name: 'Белая',
                        url: ''
                    },
                    {
                        name: 'Черная',
                        url: '../results/textures/leather-texutre.jpg'
                    },
                ]
            },
            {
                name: 'Подошва',
                url: '../results/components/Component-sole.png',
                mesh_name: [
                    'Cube.001_0',
                    'Cube.001_1',
                    'Cube.001_2',
                    'Cube.001_3',
                ],
                textures: [
                    {
                        name: 'Черная',
                        url: '../results/black-with-nose/sole-2-side-texture.jpg',
                        urls: {
                            'Cube.001_0': '../results/black-with-nose/texture4.jpg',
                            'Cube.001_1': '../results/black-with-nose/sole-2-side-texture.jpg',
                            'Cube.001_2': '../results/black-with-nose/sole-3.png',
                            'Cube.001_3': '../results/black-with-nose/sole-2-up-texture.jpg'
                        }
                    },
                    {
                        name: 'Белая',
                        url: '../results/white-with-nose/rubber-side-texture.jpg',
                        urls: {
                            'Cube.001_0': '../results/white-with-nose/main-rubber.jpg',
                            'Cube.001_1': '../results/white-with-nose/rubber-side-texture.jpg',
                            'Cube.001_2': '../results/white-with-nose/sole-bottom-texture.png',
                            'Cube.001_3': '../results/white-with-nose/rubber-up-texture.jpg'
                        }
                    },
                ],

            },
            {
                name: 'Подблочник',
                url: '../results/components/Component-podblock.png',
                mesh_name: '6,5',
                textures: [
                    leather,
                    nubuck,
                    jeans,
                ]
            },
            {
                name: 'Лэйбл',
                url: '../results/components/Component-label.png',
                mesh_name: '4'
            },
        ]
    },
    {
        name: 'Орегон',
        id: '4',
        obj_url: '../results/sneakers-high-with-high-sole.gltf',
        components: [
            {
                name: 'Основа',
                url: '../results/components/Component-body.png',
                mesh_name: ['7', '6,5'],
                textures: [
                    {
                        name: 'Кожа',
                        url: '../results/textures/red-leather-test2.jpg',
                        textures: [
                            {
                                name: 'Желтый',
                                url: '../results/textures/yellow-leather-test.jpg'
                            },
                            {
                                name: 'Красный',
                                url: '../results/textures/red-leather-test2.jpg',
                            },
                            {
                                name: 'Черный',
                                url: '../results/textures/leather-texutre.jpg'
                            },
                        ]
                    },
                    {
                        name: 'Нубук',
                        url: '../sneakers_constructor/textures/approved/nubuck/beige_nubuck.jpg',
                        textures: [
                            {
                                name: 'Бежевый',
                                url: '../textures/unwrapped/nubuck/biege-nubuck-unwrapped-min.jpg'
                            },
                            {
                                name: 'Черный',
                                url: '../textures/unwrapped/nubuck/black-nubuck-unwrapped-min.jpg'
                            },
                            {
                                name: 'Синий',
                                url: '../textures/unwrapped/nubuck/blue-nubuck-unwrapped-min.jpg'
                            },
                            {
                                name: 'Коричневый',
                                url: '../textures/unwrapped/nubuck/brown-nubuck-unwrapped-min.jpg'
                            },
                            {
                                name: 'Кирпич',
                                url: '../textures/unwrapped/nubuck/brick-nubuck-unwrapped-min.jpg'
                            },
                        ]
                    },
                    {
                        name: 'Джинс',
                        url: '../results/textures/jeans-test2.jpg',
                        textures: [
                            {
                                name: 'Синий',
                                url: '../results/textures/jeans-test2.jpg',
                            },
                            {
                                name: 'Коттон',
                                url: '../results/textures/kotton-test3.jpg'
                            }
                        ]
                    },
                ]
            },
            {
                name: 'Подкладка',
                url: '../results/components/Component-inside.png',
                mesh_name: '2',
                textures: [
                    {
                        name: 'Джинс',
                        url: '../results/textures/jeans-test2.jpg'
                    },
                    {
                        name: 'Красная',
                        url: '../results/textures/red-leather-test2.jpg'
                    },
                    {
                        name: 'Орех',
                        url: ''
                    },
                    {
                        name: 'Песок',
                        url: ''
                    },
                    {
                        name: 'Графит',
                        url: ''
                    },
                    {
                        name: 'Белая',
                        url: ''
                    },
                    {
                        name: 'Черная',
                        url: '../results/textures/leather-texutre.jpg'
                    },
                ]
            },
            {
                name: 'Подблочник',
                url: '../results/components/Component-podblock.png',
                mesh_name: '6',
                textures: [
                    {
                        name: 'Кожа',
                        url: '../results/textures/red-leather-test2.jpg',
                        textures: [
                            {
                                name: 'Желтый',
                                url: '../results/textures/yellow-leather-test.jpg'
                            },
                            {
                                name: 'Красный',
                                url: '../results/textures/red-leather-test2.jpg',
                            },
                            {
                                name: 'Черный',
                                url: '../results/textures/leather-texutre.jpg'
                            },
                        ]
                    },
                    {
                        name: 'Нубук',
                        url: '../sneakers_constructor/textures/approved/nubuck/beige_nubuck.jpg',
                        textures: [
                            {
                                name: 'Бежевый',
                                url: '../textures/unwrapped/nubuck/biege-nubuck-unwrapped-min.jpg'
                            },
                            {
                                name: 'Черный',
                                url: '../textures/unwrapped/nubuck/black-nubuck-unwrapped-min.jpg'
                            },
                            {
                                name: 'Синий',
                                url: '../textures/unwrapped/nubuck/blue-nubuck-unwrapped-min.jpg'
                            },
                            {
                                name: 'Коричневый',
                                url: '../textures/unwrapped/nubuck/brown-nubuck-unwrapped-min.jpg'
                            },
                            {
                                name: 'Кирпич',
                                url: '../textures/unwrapped/nubuck/brick-nubuck-unwrapped-min.jpg'
                            },
                        ]
                    },
                    {
                        name: 'Джинс',
                        url: '../results/textures/jeans-test2.jpg',
                        textures: [
                            {
                                name: 'Синий',
                                url: '../results/textures/jeans-test2.jpg',
                            },
                            {
                                name: 'Коттон',
                                url: '../results/textures/kotton-test3.jpg'
                            }
                        ]
                    },
                ]
            },
            {
                name: 'Лэйбл',
                url: '../results/components/Component-label.png',
                mesh_name: '4'
            },
        ]
    },
    {
        name: 'Мичиган',
        id: '5',
        obj_url: '../results/sneakers-high-with-nose.gltf',
        components: [
            {
                name: 'Основа',
                url: '../results/components/Component-body.png',
                mesh_name: '7',
                textures: [
                    {
                        name: 'Кожа',
                        url: '../results/textures/red-leather-test2.jpg',
                        textures: [
                            {
                                name: 'Желтый',
                                url: '../results/textures/yellow-leather-test.jpg'
                            },
                            {
                                name: 'Красный',
                                url: '../results/textures/red-leather-test2.jpg',
                            },
                            {
                                name: 'Черный',
                                url: '../results/textures/leather-texutre.jpg'
                            },
                        ]
                    },
                    {
                        name: 'Нубук',
                        url: '../sneakers_constructor/textures/approved/nubuck/beige_nubuck.jpg',
                        textures: [
                            {
                                name: 'Бежевый',
                                url: '../textures/unwrapped/nubuck/biege-nubuck-unwrapped-min.jpg'
                            },
                            {
                                name: 'Черный',
                                url: '../textures/unwrapped/nubuck/black-nubuck-unwrapped-min.jpg'
                            },
                            {
                                name: 'Синий',
                                url: '../textures/unwrapped/nubuck/blue-nubuck-unwrapped-min.jpg'
                            },
                            {
                                name: 'Коричневый',
                                url: '../textures/unwrapped/nubuck/brown-nubuck-unwrapped-min.jpg'
                            },
                            {
                                name: 'Кирпич',
                                url: '../textures/unwrapped/nubuck/brick-nubuck-unwrapped-min.jpg'
                            },
                        ]
                    },
                    {
                        name: 'Джинс',
                        url: '../results/textures/jeans-test2.jpg',
                        textures: [
                            {
                                name: 'Синий',
                                url: '../results/textures/jeans-test2.jpg',
                            },
                            {
                                name: 'Коттон',
                                url: '../results/textures/kotton-test3.jpg'
                            }
                        ]
                    },
                ]
            },
            {
                name: 'Подкладка',
                url: '../results/components/Component-inside.png',
                mesh_name: '2',
                textures: [
                    {
                        name: 'Джинс',
                        url: '../results/textures/jeans-test2.jpg'
                    },
                    {
                        name: 'Красная',
                        url: '../results/textures/red-leather-test2.jpg'
                    },
                    {
                        name: 'Орех',
                        url: ''
                    },
                    {
                        name: 'Песок',
                        url: ''
                    },
                    {
                        name: 'Графит',
                        url: ''
                    },
                    {
                        name: 'Белая',
                        url: ''
                    },
                    {
                        name: 'Черная',
                        url: '../results/textures/leather-texutre.jpg'
                    },
                ]
            },
            {
                name: 'Подошва',
                url: '../results/components/Component-sole.png',
                mesh_name: [
                    'Cube.001_0',
                    'Cube.001_1',
                    'Cube.001_2',
                    'Cube.001_3',
                ],
                textures: [
                    {
                        name: 'Черная',
                        url: '../results/black-with-nose/sole-2-side-texture.jpg',
                        urls: {
                            'Cube.001_0': '../results/black-with-nose/texture4.jpg',
                            'Cube.001_1': '../results/black-with-nose/sole-2-side-texture.jpg',
                            'Cube.001_2': '../results/black-with-nose/sole-3.png',
                            'Cube.001_3': '../results/black-with-nose/sole-2-up-texture.jpg'
                        }
                    },
                    {
                        name: 'Белая',
                        url: '../results/white-with-nose/rubber-side-texture.jpg',
                        urls: {
                            'Cube.001_0': '../results/white-with-nose/main-rubber.jpg',
                            'Cube.001_1': '../results/white-with-nose/rubber-side-texture.jpg',
                            'Cube.001_2': '../results/white-with-nose/sole-bottom-texture.png',
                            'Cube.001_3': '../results/white-with-nose/rubber-up-texture.jpg'
                        }
                    },
                ],

            },
            {
                name: 'Подблочник',
                url: '../results/components/Component-podblock.png',
                mesh_name: '6,5',
                textures: [
                    {
                        name: 'Кожа',
                        url: '../results/textures/red-leather-test2.jpg',
                        textures: [
                            {
                                name: 'Желтый',
                                url: '../results/textures/yellow-leather-test.jpg'
                            },
                            {
                                name: 'Красный',
                                url: '../results/textures/red-leather-test2.jpg',
                            },
                            {
                                name: 'Черный',
                                url: '../results/textures/leather-texutre.jpg'
                            },
                        ]
                    },
                    {
                        name: 'Нубук',
                        url: '../sneakers_constructor/textures/approved/nubuck/beige_nubuck.jpg',
                        textures: [
                            {
                                name: 'Бежевый',
                                url: '../textures/unwrapped/nubuck/biege-nubuck-unwrapped-min.jpg'
                            },
                            {
                                name: 'Черный',
                                url: '../textures/unwrapped/nubuck/black-nubuck-unwrapped-min.jpg'
                            },
                            {
                                name: 'Синий',
                                url: '../textures/unwrapped/nubuck/blue-nubuck-unwrapped-min.jpg'
                            },
                            {
                                name: 'Коричневый',
                                url: '../textures/unwrapped/nubuck/brown-nubuck-unwrapped-min.jpg'
                            },
                            {
                                name: 'Кирпич',
                                url: '../textures/unwrapped/nubuck/brick-nubuck-unwrapped-min.jpg'
                            },
                        ]
                    },
                    {
                        name: 'Джинс',
                        url: '../results/textures/jeans-test2.jpg',
                        textures: [
                            {
                                name: 'Синий',
                                url: '../results/textures/jeans-test2.jpg',
                            },
                            {
                                name: 'Коттон',
                                url: '../results/textures/kotton-test3.jpg'
                            }
                        ]
                    },
                ]
            },
            {
                name: 'Лэйбл',
                url: '../results/components/Component-label.png',
                mesh_name: '4'
            },
        ]
    },
];

export default mindMap;