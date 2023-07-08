function reset() {
    g_bodyAnimation=false;
    g_headAnimation=false;

    //Body part angles
    g_headXAngle=0;
    g_headYAngle=0;
    g_headZAngle=0;

    g_bodyXAngle=0;
    g_bodyYAngle=0;
    g_bodyZAngle=0;

    g_pelvisAngle=0;

    //Left Stuff
    g_leftArmXAngle=0;
    g_leftArmYAngle=0;
    g_leftArmZAngle=0;

    g_leftForeArmXAngle=0;
    g_leftForeArmYAngle=0;
    g_leftForeArmZAngle=0;

    g_leftLegXAngle=0;
    g_leftLegYAngle=0;
    g_leftLegZAngle=0;

    g_leftCalfXAngle=0;
    g_leftCalfYAngle=0;
    g_leftCalfZAngle=0;

    //Right Stuff
    g_rightArmXAngle=0;
    g_rightArmYAngle=0;
    g_rightArmZAngle=0;

    g_rightForeArmXAngle=0;
    g_rightForeArmYAngle=0;
    g_rightForeArmZAngle=0;

    g_rightLegXAngle=0;
    g_rightLegYAngle=0;
    g_rightLegZAngle=0;

    g_rightCalfXAngle=0;
    g_rightCalfYAngle=0;
    g_rightCalfZAngle=0;

    g_leftHandXAngle=0;
    g_leftHandYAngle=0;
    g_leftHandZAngle=0;

    g_rightHandXAngle=0;
    g_rightHandYAngle=0;
    g_rightHandZAngle=0;

    g_leftFootXAngle=0;
    g_leftFootYAngle=0;
    g_leftFootZAngle=0;

    g_rightFootXAngle=0;
    g_rightFootYAngle=0;
    g_rightFootZAngle=0;
}

function resetCam() {
    g_globalXAngle=0;
    g_globalYAngle=0;
    g_globalZAngle=0;
    if (g_ballVisible) {g_size=.6;} else {g_size=1}
    
}
