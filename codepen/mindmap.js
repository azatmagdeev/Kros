const mindMap = {

    components : [
        {
            name: 'Основа',
            url: '../results/components/Component-body.png',
            mesh_name:'7',
            textures:[
                {
                    name:'Кожа',
                },
                {
                    name:'Нубук',
                    url:'../sneakers_constructor/textures/approved/nubuck/beige_nubuck.jpg',
                    textures:[
                        {
                            name:'Бежевый',
                            url:'../sneakers_constructor/textures/approved/nubuck/beige_nubuck.jpg'
                        },
                        {
                            name:'Черный',
                            url:'../sneakers_constructor/textures/approved/nubuck/black_nubuck.jpg'
                        },
                        {
                            name:'Синий',
                            url:'../sneakers_constructor/textures/approved/nubuck/blue_nubuck.jpg'
                        },
                        {
                            name:'Коричневый',
                            url:'../sneakers_constructor/textures/approved/nubuck/brown_nubuck.jpg'
                        },
                        {
                            name:'Серый',
                            url:'../sneakers_constructor/textures/approved/nubuck/grey_nubuck.jpg'
                        },
                        {
                            name:'Хаки',
                            url:'../sneakers_constructor/textures/approved/nubuck/khaki_nubuck.jpg'
                        },
                    ]
                },
                {
                    name:'Джинс',
                },
            ]
        },
        {
            name: 'Подкладка',
            url: '../results/components/Component-inside.png',
            mesh_name: '2',
        },
        {
            name: 'Подошва',
            url: '../results/components/Component-sole.png',
            mesh_name:[
              'Cube.001_0',
              'Cube.001_1',
              // 'Cube.001_2',
            ],
            textures:[
                {
                    name: 'Черная',
                    url:'../results/textures/texture4.jpg',
                    urls:{
                        'Cube.001_0':'../results/textures/texture4.jpg',
                        'Cube.001_1':'../results/textures/texture2.png',
                        // 'Cube.001_2':'../results/textures/texture2.jpg',
                    }
                },
                {
                    name: 'Белая',
                    url:'../results/textures/white_rubber.png',
                    urls:{
                        'Cube.001_0':'../results/textures/white_rubber.png',
                        'Cube.001_1':'../results/textures/white_dotted_rubber.png',
                        // 'Cube.001_2':'../results/textures/texture5.png',
                    }
                },
            ],

        },
        {
            name: 'Подблочник',
            url: '../results/components/Component-podblock.png',
            mesh_name:'6,5'
        },
        {
            name: 'Лэйбл',
            url: '../results/components/Component-label.png',
            mesh_name:'4'
        },
    ]
};

export default mindMap;



// types:[
//     {
//         name:'classic',
//         url:'results/sneakers_lower_quality.gltf',
//
//     },
//     {
//         name:'high-sole',
//         url:'results/sneakers_high_sole.glb',
//     },
//     {
//         name:'with-nose',
//         url:'results/sneakers-with-nose.glb',
//     },
// ]