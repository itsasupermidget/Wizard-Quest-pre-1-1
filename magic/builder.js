function generateLevel(stage) {
  var respawning = true;
  map = new Image();
  map.src = "magic/levels/"+stage.x+","+stage.y+".png";
  collisions = [];
  enemies = 0;
  totalEnemies = 0;
  totalCollectables = 0;
  collectables = 0;
  if (!level || stage.x != level.x || stage.y != level.y) {
    level = stage;
    respawning = false;
  } else {
    message = "press start to save your password";
    messageTimer = 120;
  }
  loading = true;
  map.onload = function(){
    canvas.width = map.width;
    canvas.height = map.height;
    screen.fillStyle = "rgba(1,2,3,255)";
    screen.fillRect(0,0,canvas.width,canvas.height);
    screen.drawImage(map,0,0,map.width,map.height);
    WIDTH = map.width*SCALE*TILE;
    HEIGHT = map.height*SCALE*TILE;
    for (var y=0;y<canvas.height;y++) {
      for (var x=0;x<canvas.width;x++) {
        var pixel = screen.getImageData(x,y,1,1).data;
        var r = pixel[0];
        var g = pixel[1];
        var b = pixel[2];
        var a = pixel[3];
        if (r == 0 && g == 0 && b == 0) {
          collisions.push(new body(new vector(x*TILE,y*TILE), new sprite(new vector(64,48), new vector(16,16))));
        }
        if (r == 0 && g == 255 && b == 0 && respawning == false) {
          spawn = new vector(x*TILE,y*TILE-9);
        }
        if (r == 255 && g == 255 && b == 0) {
          var skeleton = new body(new vector(x*TILE,y*TILE),new sprite(new vector(0,48), new vector(16,16)));
          skeleton.name = "skeleton";
          skeleton.gravity = true;
          skeleton.solid = false;
          skeleton.animation = SKELETONWALK;
          collisions.push(skeleton);
          enemies += 1;
          totalEnemies += 1;
        }
        if (r == 255 && g == 255 && b == 255) {
          var spikes = new body(new vector(x*TILE,y*TILE), new sprite(new vector(128,48), new vector(16,16)));
          spikes.name = "spikes";
          spikes.solid = false;
          collisions.push(spikes);
        }
        if (r == 32 && g == 32 && b == 32) {
          var rocks = new body(new vector(x*TILE,y*TILE), new sprite(new vector(64,64), new vector(16,16)));
          rocks.name = "rocks";
          rocks.solid = false;
          collisions.push(rocks);          
        }
        if (r == 255 && g == 128 && b == 0) {
          door = new body(new vector(x*TILE,y*TILE-TILE), new sprite(new vector(0,96), new vector(16,32)));
          door.name = "door";
          door.solid = false;
          collisions.push(door);
        }
        if (r == 126 && g == 126 && b == 126) { //TL
          var staira = new body(new vector(x*TILE,y*TILE+8), new sprite(new vector(48,88), new vector(8,8)));
          var stairb = new body(new vector(x*TILE,y*TILE), new sprite(new vector(48,80), new vector(16,8)));
          collisions.push(staira);
          collisions.push(stairb);
        }          
        if (r == 127 && g == 127 && b == 127) { //BR
          var staira = new body(new vector(x*TILE+8,y*TILE), new sprite(new vector(56,64), new vector(8,8)));
          var stairb = new body(new vector(x*TILE,y*TILE+8), new sprite(new vector(48,72), new vector(16,8)));   
          var stairc = new body(new vector(x*TILE,y*TILE), new sprite(new vector(0,0), new vector(8,8)));
          var staird = new body(new vector(x*TILE-8,y*TILE+8), new sprite(new vector(0,0), new vector(8,8)));
          collisions.push(staira);
          collisions.push(stairb);
          stairc.name = "stairs";
          stairc.solid = false;
          stairc.visible = false;
          stairc.onstairs = staira;
          collisions.push(stairc);
          staird.name = "stairs";
          staird.solid = false;
          staird.visible = false;
          staird.onstairs = stairb;
          collisions.push(staird);   
        }        
        if (r == 128 && g == 128 && b == 128) { //BL
          var staira = new body(new vector(x*TILE,y*TILE), new sprite(new vector(48,48), new vector(8,8)));
          var stairb = new body(new vector(x*TILE,y*TILE+8), new sprite(new vector(48,56), new vector(16,8)));          
          var stairc = new body(new vector(x*TILE+8,y*TILE), new sprite(new vector(0,0), new vector(8,8)));
          var staird = new body(new vector(x*TILE+TILE,y*TILE+8), new sprite(new vector(0,0), new vector(8,8)));
          collisions.push(staira);
          collisions.push(stairb);
          stairc.name = "stairs";
          stairc.solid = false;
          stairc.visible = false;
          stairc.onstairs = staira;
          collisions.push(stairc);
          staird.name = "stairs";
          staird.solid = false;
          staird.visible = false;
          staird.onstairs = stairb;
          collisions.push(staird);          
        }
        if (r == 129 && g == 129 && b == 129) { //TR
          var staira = new body(new vector(x*TILE+8,y*TILE+8), new sprite(new vector(56,104), new vector(8,8)));
          var stairb = new body(new vector(x*TILE,y*TILE), new sprite(new vector(48,96), new vector(16,8)));   
          collisions.push(staira);
          collisions.push(stairb);
        }         
        if (r == 255 && g == 0 && b == 0) {
          var lava = new body(new vector(x*TILE,y*TILE), new sprite(new vector(112,48), new vector(16,16)));
          lava.name = "lava";
          lava.solid = false;
          collisions.push(lava);
        }
        if (r == 128 && g == 64 && b == 0) {
          var chest = new body(new vector(x*TILE,y*TILE), CHESTCLOSED);
          chest.name = "chest";
          chest.solid = false;
          collectables += 1;
          totalCollectables += 1;
          collisions.push(chest);
        }
        if (r == 128 && g == 128 && b == 255) {
          var ladder = new body(new vector(x*TILE,y*TILE), new sprite(new vector(80,64), new vector(16,16)));
          ladder.name = "ladder";
          ladder.solid = false;
          collisions.push(ladder);
          if (ladder.canMove(new vector(0,-1),true)) {
            var ladderTop = new body(new vector(x*TILE,y*TILE-11), new sprite(new vector(64,648), new vector(16,16)));
            ladderTop.name = "platform";
            ladderTop.solid = false;
            ladderTop.visible = false;
            collisions.push(ladderTop);
          }
        }
        if (r == 0 && g == 0 && b == 255) {
          var knight = new body(new vector(x*TILE,y*TILE-16),new sprite(new vector(112,96), new vector(16,32)));
          knight.name = "knight";
          knight.gravity = true;
          knight.solid = false;
          knight.facing = -1;
          collisions.push(knight);
          enemies += 1;
          totalEnemies += 1;          
        }
        if (r == 255 && g == 0 && b == 255) {
          var heart = new body(new vector(x*TILE+8,y*TILE+8),new sprite(new vector(0,128), new vector(8,8)));
          heart.name = "heart";
          heart.solid = false;
          collisions.push(heart);
        }
        if (r == g && g == b) {
          if (r >= 64 && r <= 66) {
            var timer = new body(new vector(x*TILE,y*TILE), new sprite(new vector(48,112), new vector(16,16)));
            timer.name = "timer";
            timer.health = r-63;
            collisions.push(timer);
          }
        }
        if (r == 255 && g == 255 && b == 128) {
          var sb = new body(new vector(x*TILE-8,y*TILE-56),new sprite(new vector(0,0), new vector(96,144)));
          sb.name = "skeleboss";
          sb.solid = false;
          sb.animation = BOSSDROP;
          collisions.push(sb);
          boss = sb;
          enemies += 1;
          totalEnemies += 1;          
        }
        if (r == 0 && g == 128 && b == 0) {
          collisions.push(new body(new vector(x*TILE,y*TILE), new sprite(new vector(0,648), new vector(16,16))));
        }      
        if (r == 64 && g == 32 && b == 0) {
          collisions.push(new body(new vector(x*TILE,y*TILE), new sprite(new vector(16,648), new vector(16,16))));
        } 
        if (r == 128 && g == 128 && b == 0) {
          var platform = new body(new vector(x*TILE,y*TILE), new sprite(new vector(64,648), new vector(16,16)));
          platform.name = "platform";
          platform.solid = false;
          collisions.push(platform);
        }     
        if (r == 64 && g == 64 && b == 0) {
          var stick = new body(new vector(x*TILE,y*TILE), new sprite(new vector(48,648), new vector(16,16)));
          stick.name = "stick";
          stick.solid = false;
          collisions.push(stick);
        }
        if (r == 128 && g == 128 && b == 64) {
          var corner = new body(new vector(x*TILE,y*TILE), new sprite(new vector(112,648), new vector(16,16)));
          corner.name = "corner";
          corner.solid = false;
          collisions.push(corner);          
        }
        if (r == 128 && g == 200 && b == 0) {
          var platform = new body(new vector(x*TILE,y*TILE), new sprite(new vector(16,792), new vector(16,16)));
          platform.name = "platform"; //left leaf
          platform.solid = false;
          collisions.push(platform);
        }     
        if (r == 128 && g == 200 && b == 8) {
          var platform = new body(new vector(x*TILE,y*TILE), new sprite(new vector(32,792), new vector(16,16)));
          platform.name = "platform"; //right leaf
          platform.solid = false;
          collisions.push(platform);
        }          
        if (r == 100 && g == 64 && b == 0) {
          var stick = new body(new vector(x*TILE,y*TILE), new sprite(new vector(0,792), new vector(16,16)));
          stick.name = "stick"; //tree
          stick.solid = false;
          collisions.push(stick);
        }
        if (r == 200 && g == 128 && b == 64) {
          var corner = new body(new vector(x*TILE,y*TILE), new sprite(new vector(48,792), new vector(16,16)));
          corner.name = "corner"; //tree corner
          corner.solid = false;
          collisions.push(corner);          
        }                               
        if (r == 255 && g == 128 && b == 128) {
          var beehive = new body(new vector(x*TILE,y*TILE), BEEHIVE);
          beehive.name = "beehive";
          beehive.solid = false;
          collisions.push(beehive);
        }
        if (r == 255 && g == 255 && b == 32) {
          var bees = new body(new vector(x*TILE,y*TILE), new sprite(new vector(0,0), new vector(0,0)));
          bees.name = "bees";
          bees.solid = false;
          collisions.push(bees);
          enemies += 1;
          totalEnemies += 1;          
        }
        if (r == 0 && g == 64 && b == 0) {
          var plant = new body(new vector(x*TILE,y*TILE-8), new sprite(new vector(0,0), new vector(0,0)));
          plant.name = "plant";
          plant.solid = false;
          plant.animation = PLANT;
          collisions.push(plant);
          enemies += 1;
          totalEnemies += 1;          
        }
        if (r == 128 && g == 64 && b == 64) {
          var warrior = new body(new vector(x*TILE,y*TILE-TILE), new sprite(new vector(0,0), new vector(0,0)));
          warrior.name = "warrior";
          warrior.solid = false;
          warrior.animation = WARRIOR;
          warrior.gravity = true;
          collisions.push(warrior);
          enemies += 1;
          totalEnemies += 1;          
        }    
        if (r == 0 && g == 200 && b == 0) {
          var bush = new body(new vector(x*TILE,y*TILE), new sprite(new vector(0,0), new vector(0,0)));
          bush.name = "bush";
          bush.solid = false;
          bush.animation = BUSH;
          collisions.push(bush);      
        }  
        if (r == 64 && g == 200 && b == 0) {
          var bush = new body(new vector(x*TILE,y*TILE), new sprite(new vector(0,0), new vector(0,0)));
          bush.name = "evilbush";
          bush.solid = false;
          bush.animation = EVILBUSH.clone();
          collisions.push(bush);      
          enemies += 1;
          totalEnemies += 1;
        }         
        if (r == 128 && g == 64 && b == 16) {
          var monkey = new body(new vector(x*TILE,y*TILE), new sprite(new vector(0,0), new vector(0,0)));
          monkey.name = "monkey";
          monkey.solid = false;
          monkey.animation = MONKEY;
          monkey.gravity = true;
          collisions.push(monkey);      
          enemies += 1;
          totalEnemies += 1;
        }     
        if (r == 128 && g == 64 && b == 32) {
          var monkey = new body(new vector(x*TILE,y*TILE), new sprite(new vector(0,0), new vector(0,0)));
          monkey.name = "monkey";
          monkey.maxHealth = 200;
          monkey.health = 200;
          monkey.solid = false;
          monkey.animation = SKELEMONKEY;
          monkey.gravity = true;
          collisions.push(monkey);      
          enemies += 1;
          totalEnemies += 1;
        }                  
      }
    }
    loading = false;
    player.position.x = spawn.x;
    player.position.y = spawn.y;
    player.velocity.x = 0;
    player.velocity.y = 0;
    player.animation = RESPAWN.clone();
    player.attacks = [];
    player.children = [];
    collisions.push(player);
  } 
}