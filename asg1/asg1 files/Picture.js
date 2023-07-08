class Picture {
    render() {
        let point = new Triangle();
        var pos = [0, 0]
        point.position=[0, 0];
        point.size=0;

        //Rocketship
        point.color=[0.70, 0.70, 0.70, 1.0].slice()
        point.render()
        
        drawTriangle([pos[0]-20/200, pos[1]-30/200, pos[0]-20/200, pos[1]+30/200, pos[0]+20/200, pos[1]-30/200]);
        drawTriangle([pos[0]+20/200, pos[1]+30/200, pos[0]+20/200, pos[1]-30/200, pos[0]-20/200, pos[1]+30/200]);
        
        point.color=[0.0, 1.0, 1.0, 1.0].slice()
        point.render()
        drawTriangle([pos[0]-10/200, pos[1]-10/200, pos[0]-10/200, pos[1]+10/200, pos[0]+10/200, pos[1]-10/200]);
        drawTriangle([pos[0]+10/200, pos[1]+10/200, pos[0]+10/200, pos[1]-10/200, pos[0]-10/200, pos[1]+10/200]);
        
        pos = [0, 40/200]
        point.color=[1.0, 0.0, 0.0, 1.0].slice()
        point.render()
        drawTriangle([pos[0]-30/200, pos[1]-10/200, pos[0], pos[1]+20/200, pos[0]+30/200, pos[1]-10/200]);
        pos = [0, -20/200]
        drawTriangle([pos[0]-20/200, pos[1], pos[0]-20/200, pos[1]-10/200, pos[0]-30/200, pos[1]-10/200]);
        drawTriangle([pos[0]+20/200, pos[1], pos[0]+20/200, pos[1]-10/200, pos[0]+30/200, pos[1]-10/200]);
        drawTriangle([pos[0]-30/200, pos[1]-20/200, pos[0]-20/200, pos[1]-10/200, pos[0]-30/200, pos[1]-10/200]);
        drawTriangle([pos[0]+30/200, pos[1]-20/200, pos[0]+20/200, pos[1]-10/200, pos[0]+30/200, pos[1]-10/200]);
    
        pos = [0, -40/200]
        point.color=[1.0, 0.5, 0.0, 1.0].slice()
        point.render()
        drawTriangle([pos[0]-20/200, pos[1]+10/200, pos[0], pos[1]-20/200, pos[0]+20/200, pos[1]+10/200]);

        //Stars
        pos = [-80/200, 0]
        point.color=[1.0, 1.0, 1.0, 1.0].slice()
        point.render()
        drawTriangle([pos[0]-2.5/200, pos[1]-2.5/200, pos[0]-2.5/200, pos[1]+2.5/200, pos[0]+2.5/200, pos[1]-2.5/200]);
        drawTriangle([pos[0]+2.5/200, pos[1]+2.5/200, pos[0]+2.5/200, pos[1]-2.5/200, pos[0]-2.5/200, pos[1]+2.5/200]);
        pos = [-60/200, 70/200]
        drawTriangle([pos[0]-2.5/200, pos[1]-2.5/200, pos[0]-2.5/200, pos[1]+2.5/200, pos[0]+2.5/200, pos[1]-2.5/200]);
        drawTriangle([pos[0]+2.5/200, pos[1]+2.5/200, pos[0]+2.5/200, pos[1]-2.5/200, pos[0]-2.5/200, pos[1]+2.5/200]);
        pos = [-60/200, 70/200]
        drawTriangle([pos[0]-2.5/200, pos[1]-2.5/200, pos[0]-2.5/200, pos[1]+2.5/200, pos[0]+2.5/200, pos[1]-2.5/200]);
        drawTriangle([pos[0]+2.5/200, pos[1]+2.5/200, pos[0]+2.5/200, pos[1]-2.5/200, pos[0]-2.5/200, pos[1]+2.5/200]);
        pos = [60/200, 50/200]
        drawTriangle([pos[0]-2.5/200, pos[1]-2.5/200, pos[0]-2.5/200, pos[1]+2.5/200, pos[0]+2.5/200, pos[1]-2.5/200]);
        drawTriangle([pos[0]+2.5/200, pos[1]+2.5/200, pos[0]+2.5/200, pos[1]-2.5/200, pos[0]-2.5/200, pos[1]+2.5/200]);
        pos = [90/200, -40/200]
        drawTriangle([pos[0]-2.5/200, pos[1]-2.5/200, pos[0]-2.5/200, pos[1]+2.5/200, pos[0]+2.5/200, pos[1]-2.5/200]);
        drawTriangle([pos[0]+2.5/200, pos[1]+2.5/200, pos[0]+2.5/200, pos[1]-2.5/200, pos[0]-2.5/200, pos[1]+2.5/200]);
        pos = [-50/200, -40/200]
        drawTriangle([pos[0]-2.5/200, pos[1]-2.5/200, pos[0]-2.5/200, pos[1]+2.5/200, pos[0]+2.5/200, pos[1]-2.5/200]);
        drawTriangle([pos[0]+2.5/200, pos[1]+2.5/200, pos[0]+2.5/200, pos[1]-2.5/200, pos[0]-2.5/200, pos[1]+2.5/200]);
        pos = [40/200, -70/200]
        drawTriangle([pos[0]-2.5/200, pos[1]-2.5/200, pos[0]-2.5/200, pos[1]+2.5/200, pos[0]+2.5/200, pos[1]-2.5/200]);
        drawTriangle([pos[0]+2.5/200, pos[1]+2.5/200, pos[0]+2.5/200, pos[1]-2.5/200, pos[0]-2.5/200, pos[1]+2.5/200]);

        //Asteroid
        pos = [(120/1.5)/200, (140/1.5)/200]
        point.color=[0.7, 0.9, 0.9, 1.0].slice()
        point.render()
        drawTriangle([pos[0]+20/200, pos[1], pos[0], pos[1]+10/200, pos[0], pos[1]-10/200]);
        point.color=[0.5, 0.5, 0.5, 1.0].slice()
        point.render()
        
        drawTriangle([pos[0], pos[1], pos[0]+10/200, pos[1], pos[0], pos[1]+10/200]);
        drawTriangle([pos[0], pos[1], pos[0]+10/200, pos[1], pos[0], pos[1]-10/200]);
        drawTriangle([pos[0], pos[1], pos[0]-10/200, pos[1], pos[0], pos[1]-10/200]);
        drawTriangle([pos[0], pos[1], pos[0]-10/200, pos[1], pos[0], pos[1]+10/200]);

        //Moon
        pos = [0, 200/200]
        point.color=[0.8, 0.8, 0.8, 1.0].slice()
        point.render()
        drawTriangle([pos[0], pos[1], pos[0]-50/200, pos[1], pos[0]-30/200, pos[1]-30/200]);
        drawTriangle([pos[0], pos[1], pos[0], pos[1]-40/200, pos[0]-30/200, pos[1]-30/200]);
        drawTriangle([pos[0], pos[1], pos[0], pos[1]-40/200, pos[0]+30/200, pos[1]-30/200]);
        drawTriangle([pos[0], pos[1], pos[0]+50/200, pos[1], pos[0]+30/200, pos[1]-30/200]);

        //Earth
        pos = [0, -200/200]
        point.color=[0.0, 0.5, 1.0, 1.0].slice()
        point.render()
        drawTriangle([pos[0], pos[1], pos[0]-100/200, pos[1], pos[0]-60/200, pos[1]+60/200]);
        drawTriangle([pos[0], pos[1], pos[0], pos[1]+80/200, pos[0]-60/200, pos[1]+60/200]);
        drawTriangle([pos[0], pos[1], pos[0], pos[1]+80/200, pos[0]+60/200, pos[1]+60/200]);
        drawTriangle([pos[0], pos[1], pos[0]+100/200, pos[1], pos[0]+60/200, pos[1]+60/200]);
        point.color=[0.5, 1.0, 0.25, 1.0].slice()
        point.render()
        
        pos = [0, -140/200]
        drawTriangle([pos[0], pos[1]+20/200, pos[0]-60/200, pos[1], pos[0]+60/200, pos[1]]);
        
        pos = [0, -120/200]
        drawTriangle([pos[0], pos[1], pos[0]+60/200, pos[1]-20/200, pos[0]+100/200, pos[1]-80/200]);

        pos = [0, -200/200]
        drawTriangle([pos[0]-80/200, pos[1], pos[0]-100/200, pos[1], pos[0]-80/200, pos[1]+30/200]);

        //Sun
        pos = [-120/200, 170/200]
        point.color=[1.0, 1.0, 0.0, 1.0].slice()
        point.render()
        drawTriangle([pos[0], pos[1], pos[0]-20/200, pos[1], pos[0]-12/200, pos[1]+12/200]);
        drawTriangle([pos[0], pos[1], pos[0], pos[1]+16/200, pos[0]-12/200, pos[1]+12/200]);
        drawTriangle([pos[0], pos[1], pos[0], pos[1]+16/200, pos[0]+12/200, pos[1]+12/200]);
        drawTriangle([pos[0], pos[1], pos[0]+20/200, pos[1], pos[0]+12/200, pos[1]+12/200]);

        drawTriangle([pos[0], pos[1], pos[0]-20/200, pos[1], pos[0]-12/200, pos[1]-12/200]);
        drawTriangle([pos[0], pos[1], pos[0], pos[1]-16/200, pos[0]-12/200, pos[1]-12/200]);
        drawTriangle([pos[0], pos[1], pos[0], pos[1]-16/200, pos[0]+12/200, pos[1]-12/200]);
        drawTriangle([pos[0], pos[1], pos[0]+20/200, pos[1], pos[0]+12/200, pos[1]-12/200]);

        //UFO
        pos = [160/200, -100/200]
        point.color=[0.0, 1.0, 1.0, 1.0].slice()
        point.render()
        drawTriangle([pos[0], pos[1], pos[0]-10/200, pos[1], pos[0]-6/200, pos[1]+6/200]);
        drawTriangle([pos[0], pos[1], pos[0], pos[1]+8/200, pos[0]-6/200, pos[1]+6/200]);
        drawTriangle([pos[0], pos[1], pos[0], pos[1]+8/200, pos[0]+6/200, pos[1]+6/200]);
        drawTriangle([pos[0], pos[1], pos[0]+10/200, pos[1], pos[0]+6/200, pos[1]+6/200]);

        point.color=[0.4, 0.4, 0.4, 1.0].slice()
        point.render()
        drawTriangle([pos[0]-15/200, pos[1], pos[0]+15/200, pos[1], pos[0]-15/200, pos[1]-5/200]);
        drawTriangle([pos[0]+15/200, pos[1], pos[0]+15/200, pos[1]-5/200, pos[0]-15/200, pos[1]-5/200]);
        drawTriangle([pos[0]-10/200, pos[1], pos[0]+10/200, pos[1], pos[0]-10/200, pos[1]-10/200]);
        drawTriangle([pos[0]+10/200, pos[1], pos[0]-10/200, pos[1], pos[0]+10/200, pos[1]-10/200]);
    }
}