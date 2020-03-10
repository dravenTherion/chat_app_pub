export function randName(){
    
    const adjectives = [
                        'red', 
                        'green', 
                        'blue', 
                        'cyan', 
                        'magenta', 
                        'yellow', 
                        'brown', 
                        'cool', 
                        'chill', 
                        'funny', 
                        'bad', 
                        'good', 
                        'bitter',
                        'spicy',
                        'sour',
                        'salty',
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
                    'adobo',
                    'sinigang',
                    'tinola',
                  ]
    
    
    return  (
                adjectives[ Math.floor(Math.random() * adjectives.length) ] 
                + '_' +
                nouns[ Math.floor(Math.random() * nouns.length) ]
            );
    
}


export function randColor() {
    return '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16);
}


export function randRange(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


export default ({

    name: randName,
    color: randColor,
    range: randRange

});
