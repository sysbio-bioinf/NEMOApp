let slide = `
<GridLayout id="breath" row="0" rows="auto, *, *, *">
    <Label row="0" text="{{ breathQuery }}" textWrap="true" fontSize="{{ mySize }}" class="question text-center" />
    <Button row="2" id="0" text="{{ breathAnswer0 }}" fontSize="{{ mySize }}" class="-btn my-button-grad0 my-button-grad0:active capitalization" tap="{{ switchTab }}" />
    <Button row="3" id="1" text="{{ breathAnswer1 }}" fontSize="{{ mySize }}" class="-btn my-button-grad1 my-button-grad1:active capitalization" tap="{{ switchTab }}" />
</GridLayout>
`;

module.exports = {slide};
