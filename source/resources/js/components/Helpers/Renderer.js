let _canvas,
    _context,
    
    _list,
    
    _spritesheet,
    
    _loaded = false,
    
    _ctrBeforeUpdate = {current: 0, max: 1};


function _init(canvas, list, spritesheet){
    
    _setCanvas(canvas);
    _setList(list); 
    _setSpritesheet(spritesheet);
}
    
function _setCanvas(canvas){
    _canvas = canvas;
    _context = canvas.getContext('2d');
}

function _setList(list){
    _list = list;
    
    //console.log('list', _list);
}    

function _setSpritesheet(spritesheet){
    _spritesheet = document.createElement('img');
    _spritesheet.addEventListener('load', (e)=>{_loaded=true;});
    _spritesheet.src = spritesheet;
}

function _renderCanvas(){
    
    if(!_loaded)
        return;
    
    const newList = _list;
    
    newList.sort((a, b)=>{ return a.y - b.y; });

    
    _context.clearRect(0, 0, _canvas.width, _canvas.height);
    
    for(let ctr = 0; ctr < newList.length; ctr++)
    {        
        let item = newList[ctr],
            frame = item.frames[ item.currentFrameSet ],
            direction = item.direction;
        
        _context.save();
            
            _context.translate((direction < 0 ? item.x * 2 + frame.frameWidth - 55 : - 40), - 95);
            _context.scale(direction, 1);

            _context.drawImage(_spritesheet, frame.frameOffsetX, frame.frameHeight * frame.framesCurrent, frame.frameWidth, frame.frameHeight, item.x, item.y, frame.frameWidth, frame.frameHeight);
            
        _context.restore();
            
        
        if(_ctrBeforeUpdate.curr < _ctrBeforeUpdate.max)
            frame.framesCurrent++;
    }
    
    if(_ctrBeforeUpdate.curr < _ctrBeforeUpdate.max)
        _ctrBeforeUpdate.curr++;
    else
        _ctrBeforeUpdate.curr = 0;
    
}

function _frame(frameOffsetX, frameOffsetY, frameWidth, frameHeight, framesMax, framesCurr){
    
    let _framesMax = framesMax,
        _framesCurr = framesCurr;
        
    this.frameOffsetX = frameOffsetX || 0;
    this.frameOffsetY = frameOffsetY || 0;
                
    this.frameWidth  =  frameWidth || 0;
    this.frameHeight =  frameHeight || 0;
                
    //Define getters and setters
    Object.defineProperties(
        this, 
        {
            'framesMax' : {
                get: _getFramesMax
            },
                'framesCurrent' : {
                get: _getFramesCurr,
                set: _setFramesCurr
            }
        }
    );
    
    //getter and setter functions 
    function _getFramesMax(){
        return _framesMax;
    }
        
    function _getFramesCurr(){
        return _framesCurr;        
    }
        
    function _setFramesCurr(frame){            
        _framesCurr = frame < _framesMax ? frame : 0 ;            
    }
    
}

export default ({
    
    init: _init,
    setCanvas: _setCanvas,
    setList: _setList,
    setSpritesheet: _setSpritesheet,
    renderCanvas: _renderCanvas,
    
    frame: _frame
    
})