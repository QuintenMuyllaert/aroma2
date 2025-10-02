local image

function love.load()
  love.graphics.setBackgroundColor(1, 1, 1)
  image = love.graphics.newImage("hi.png")
end

function love.update(dt)
  love.angle = (love.angle or 0) + dt
end

function love.draw()
  love.graphics.setColor(1, 1, 1)

  if image then
    love.graphics.draw(image, 180, 140, 0, 1, 1, image:getWidth() / 2, image:getHeight() / 2)
  end

  love.graphics.setColor(1, 0.75, 0.8)
  love.graphics.push()
  love.graphics.translate(400, 300)
  love.graphics.rotate(love.angle or 0)
  love.graphics.polygon('fill', -50, -50, 50, -50, 0, 50)
  love.graphics.pop()
end
