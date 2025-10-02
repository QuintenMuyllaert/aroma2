

function love.load()
    love.graphics.setBackgroundColor(1, 1, 1) -- Set background color to white
end

function love.update(dt)
    -- Increment the angle of rotation
    if not love.angle then
        love.angle = 0
    end
    love.angle = love.angle + dt
end

function love.draw()
    love.graphics.setColor(1, 0.75, 0.8) -- Set color to pink
    love.graphics.push() -- Start a new matrix stack
    love.graphics.translate(400, 300) -- Move the origin to the center of the screen
    love.graphics.rotate(love.angle) -- Rotate the coordinate system
    love.graphics.polygon('fill', -50, -50, 50, -50, 0, 50) -- Draw a triangle
    love.graphics.pop() -- Restore the original matrix stack
end

