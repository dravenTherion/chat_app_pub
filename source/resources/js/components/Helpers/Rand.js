function _getName(){
    
    const adjectives = [
                        'red', 
                        'green', 
                        'blue', 
                        'cyan', 
                        'magenta', 
                        'yellow', 
                        'cool', 
                        'chill', 
                        'funny', 
                        'bad', 
                        'good', 
                        'bitter', 
                        'grumpy', 
                        'happy',
                        'sad',
                        'quiet',
                        'skittish',
                        'shady',
                        'mysterious',
                        'wild',
                        'solitary',
                        'funky',
                        'fresh',
                        'withered',
                        'old',
                        'young',
                        'nervous',
                        'brave',
                        'proud',
                        'jumpy',
                        'alien',
                        'sleepy',
                        'hungry',
                        'confident',
                        'silent',
                        'loud',
                        'gloomy',
                       ];
    
    const nouns = [
                    'cat',
                    'dog',
                    'bird',
                    'lizard',
                    'horse',
                    'cow',
                    'pig',
                    'sheep',
                    'mouse',
                    'weed',
                    'tree',
                    'koala',
                    'bear',
                    'tiger',
                    'monkey',
                    'donkey',
                    'vulture',
                    'spider',
                    'crow',
                  ]
    
    
    return  (
                adjectives[ Math.floor(Math.random() * adjectives.length) ] 
                + '_' +
                nouns[ Math.floor(Math.random() * nouns.length) ]
            );
    
}


function _getColor() {
    return '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16);
}


function _range(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default ({
    
    getName: _getName,
    getColor: _getColor,
    range: _range
    
});