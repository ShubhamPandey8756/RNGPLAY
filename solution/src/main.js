
import { Application, Sprite, Assets, Container, Text, TextStyle, colorBitGl } from "pixi.js";

(async () => {
    // Create the PIXI application
    const app = new Application();
    await app.init(
        {
         width:1920,
         height:1080,
         resizeTo: window,
          antialias: true,
          backgroundColor: 0x000000,

        } 
      );//sets initial configuration of my app

      

     
      app.canvas.style.position = 'absolute'; // Attach the canvas to the document
    document.body.appendChild(app.canvas);

    // Load the bonus background
    const bgTexture = await Assets.load('images/BonusFrame.png');
    const bgSprite = Sprite.from(bgTexture);
    bgSprite.width = app.canvas.width;
    bgSprite.height = app.canvas.height;
    app.stage.addChild(bgSprite);

    // Wins array and a set to track used wins
    const winValues = [100, 200, 300, 400, 500, 600];
    const usedWins = new Set();

    // Create container for icons
    const iconContainer = new Container();
    app.stage.addChild(iconContainer);

    // Load the icon texture
    const iconTexture = await Assets.load('images/bonusIcon.png');

    // Icon positions (calculated dynamically)
    const positions = [
        { x: app.view.width * 0.2, y: app.view.height * 0.3 },
        { x: app.view.width * 0.5, y: app.view.height * 0.3 },
        { x: app.view.width * 0.8, y: app.view.height * 0.3 },
        { x: app.view.width * 0.2, y: app.view.height * 0.6 },
        { x: app.view.width * 0.5, y: app.view.height * 0.6 },
        { x: app.view.width * 0.8, y: app.view.height * 0.6 },
    ];

    // Create a reusable text object for displaying wins
    const winText = new Text("", new TextStyle({
        fontFamily: "Arial",
        fontSize: 36,
        fill: "#FFFFFF",
        fontWeight: "bold",
    }));
    winText.anchor.set(0.5);
    winText.position.set(app.view.width / 2, app.view.height - 50);
    winText.visible = false; // Initially hidden
    app.stage.addChild(winText);

    // Helper function: Animate sprite scaling
    const animateScale = (sprite, targetScale, duration) => {
        const startScale = sprite.scale.x;
        const delta = targetScale - startScale;
        let elapsed = 0;

        app.ticker.add((deltaTime) => {
            if (elapsed >= duration) return;
            elapsed += deltaTime;
            const progress = Math.min(elapsed / duration, 1);
            sprite.scale.set(startScale + delta * progress);
        });
    };

    // Create icons with interactivity
    positions.forEach((pos) => {
        const icon = new Sprite(iconTexture);
        icon.anchor.set(0.5); // Center the anchor point
        icon.scale.set(0.5); // Initial scale
        icon.position.set(pos.x, pos.y);
        icon.interactive = true; // Enable interactivity
        icon.buttonMode = true; // Show pointer on hover

     // Initialize previousWin variable
let previousWin = null;

// Click event for the icon
icon.on("pointerdown", () => {
    // Get a random win value that's different from the last one
    let randomWin;
    do {
        randomWin = winValues[Math.floor(Math.random() * winValues.length)];
    } while (randomWin === previousWin); // Make sure it's not the same as the previous win

    // Store the current win as previousWin for the next click
    previousWin = randomWin;

    // Update and show win text
    winText.text = `You Win: ${randomWin}`;
    winText.visible = true; // Make the text visible

    // Hide the win message after 2 seconds
    setTimeout(() => {
        winText.visible = false; // Hide it to prevent overlap
    }, 2000);
    icon.scale.set(icon.scale.x * 1.5, icon.scale.y * 1.5); // Increase scale by 10%

    // Return to original scale after 0.2 seconds (adjust as needed)
    setTimeout(() => {
        icon.scale.set(icon.scale.x / 1.5, icon.scale.y / 1.5); // Reset to original scale
    }, 500); // Delay before returning to original scale

});

        // Add the icon to the container
        iconContainer.addChild(icon);
    });
})();
      


