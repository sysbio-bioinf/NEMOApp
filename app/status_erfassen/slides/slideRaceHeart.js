let slide = `
<GridLayout id="raceheart" row="0" rows="auto, *, auto">
    <Label row="0" text="{{ raceHeartQuery }}" textWrap="true" fontSize="{{ mySize }}" class="question text-center" />
    <StackLayout row="1" id="raceheartQuery" orientation="horizontal" width="160">
        <Label text="Puls: " fontSize="{{ mySize }}" verticalAlignment="middle" class="weight-separator"/>
        <ListPicker items = "{{ pulseItems }}" selectedIndex="{{ pulseIndex }}" selectedValue="{{ pulseSelected }}" id="pulse" width="60" height="200" />
    </StackLayout>
    <Button row="2" text="{{nextSlideButton}}" fontSize="{{ mySize }}" class="-btn btn-primary my-button-primary my-button-grad3:active" margin="5" tap="{{ switchTab }}"/>
</GridLayout>
`;

module.exports = {slide};
