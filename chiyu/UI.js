var rect_curving = 0.2;
var alpha_gradient = 1;

function instant_text(string, size, x, y, colour = color(0), middle = false)
{
    noSmooth()
    textSize(size)
    fill(colour)
    strokeWeight(0)
    var offX = 0;
    if(middle){offX = textWidth(string)/2}
    text(string, x - offX, y + textAscent())
    fill(255)
    smooth()
}


class label
{
    constructor(text_value, position_x, position_y, size, color, time_offset = 0)
    {
        this.text = text_value
        this.text_size = size
        this.x = position_x
        this.y = position_y
        this.col = color
        this.externalAlpha = 0;
        this.lifetime = -time_offset
    }

    render()
    {
        var alpha = Math.min(1, this.lifetime);
        alpha = Math.max(0, alpha)
        this.externalAlpha = alpha*this.col[3]*255;
        instant_text(this.text, this.text_size, this.x, this.y, color(this.col[0], this.col[1], this.col[2], this.externalAlpha), true);
        this.lifetime += alpha_gradient*3*deltaTime/1000;
        this.lifetime = Math.min(this.lifetime, 1);
    }
}

class dynamic_image
{
    constructor(img, x, y, img_w, img_h, time_offset = 0)
    {
        this.x = x;
        this.y = y;
        this.img = img;
        this.width = img_w;
        this.height = img_h;
        this.externalAlpha = 0;
        this.lifetime = -time_offset;
    }

    render()
    {
        var alpha = Math.min(1, this.lifetime);
        this.externalAlpha = alpha*255;
        tint(255, this.externalAlpha);
        noSmooth();
        image(this.img, this.x, this.y, this.width, this.height);

        this.lifetime += alpha_gradient*3*deltaTime/1000;
        this.lifetime = Math.min(this.lifetime, 1);
    }
}

class button
{
    constructor(txt, x, y, width, height, default_color, text_color, action, time_offset = 0, check_answered = false)
    {
        this.selected = false;
        this.action = action;
        this.pos = {x: x, y: y};
        this.height = height;
        this.width = width;
        /**@type Color */
        this.default_color = default_color;
        /**@type Color */
        this.color =  default_color;
        /**@type Color */
        this.target_color = default_color;
        /**@type Color */
        this.text_color = text_color;
        this.text = txt;
        this.lifetime = -time_offset;
        this.externalAlpha = 0;
        this.was_pressed = false;
        this.check_answered = check_answered;
    }

    render()
    {
        var alpha = Math.min(1, this.lifetime);
        alpha = Math.max(0, alpha)
        this.externalAlpha = alpha*255;

        if(this.over() && !this.was_pressed)
        { 
            this.target_color = color(this.default_color.levels[0]/1.15,this.default_color.levels[1]/1.15,this.default_color.levels[2]/1.15)
            if(clicked && !this.was_pressed && ((this.check_answered && !answered) || !this.check_answered))
            {
                this.was_pressed = true;
                this.action();
            }
        }
        else
        {
            this.target_color = this.default_color;
        }

        this.color = color(this.color.levels[0] + deltaTime*0.01*(this.target_color.levels[0] - this.color.levels[0]), this.color.levels[1] + deltaTime*0.01*(this.target_color.levels[1] - this.color.levels[1]), this.color.levels[2] + deltaTime*0.01*(this.target_color.levels[2] - this.color.levels[2]), this.externalAlpha)
        

        fill(this.color);
        rect(this.pos.x, this.pos.y, this.width, this.height, rect_curving*this.height/3);
        instant_text(this.text, this.height*0.7,this.pos.x + this.width/2, this.pos.y - (this.height/2)/0.6, color(this.text_color[0], this.text_color[1], this.text_color[2], this.externalAlpha), true);

        this.lifetime += alpha_gradient*3*deltaTime/1000;
        this.lifetime = Math.min(this.lifetime, 1);
    }

    over()
    {
        var overX = mouseX > this.pos.x && mouseX < this.pos.x + this.width;
        var overY = mouseY > this.pos.y && mouseY < this.pos.y + this.height;
        return overX && overY;
    }
}

