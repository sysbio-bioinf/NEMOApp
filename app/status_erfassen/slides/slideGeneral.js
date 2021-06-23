let slide = `
<GridLayout id="wellness" row="0" rows="auto, *, *, *, *, *">
    <Label row="0" text="{{ wellnessQuery }}" fontSize="{{ mySize }}" textWrap="true" class="question text-center" />
    <Button row="2" id="0" text="{{ wellnessAnswer0 }}" fontSize="{{ mySize }}" class="-btn -btn-primary my-button-grad0 my-button-grad0:active capitalization" tap="{{ switchTab }}" />
    <Button row="3" id="1" text="{{ wellnessAnswer1 }}" fontSize="{{ mySize }}" class="-btn -btn-primary my-button-grad1 my-button-grad1:active capitalization" tap="{{ switchTab }}" />
    <Button row="4" id="2" text="{{ wellnessAnswer2 }}" fontSize="{{ mySize }}" class="-btn -primary my-button-grad2 my-button-grad2:active capitalization" tap="{{ switchTab }}" />
    <Button row="5" id="3" text="{{ wellnessAnswer3 }}" fontSize="{{ mySize }}" class="-btn -primary my-button-grad3 my-button-grad3:active capitalization" tap="{{ switchTab }}" />
</GridLayout>
`;

module.exports = {slide};
