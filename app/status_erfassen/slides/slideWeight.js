let slide = `
<GridLayout id="weight" row="0" rows="auto, *, auto">
    <Label row="0" text="{{ weightQuery }}" textWrap="true" fontSize="{{ mySize }}" class="question text-center" />
    <StackLayout row="1" id="weightQuery" orientation="horizontal" width="160">
        <ListPicker items = "{{ kgItems }}" selectedIndex = "{{ kgIndex }}" selectedValue = "{{ kgSelected }}" id="weightKg" width="60" height="{{ kgHeight }}" />
        <Label text="," verticalAlignment="middle" class="weight-separator"/>
        <ListPicker items = "{{ hgItems }}" selectedIndex = "{{ hgIndex }}" selectedValue = "{{ hgSelected }}" id="weightHg" width="60" height="200" />
        <Label text="kg" verticalAlignment="middle" class="weight-label" />
    </StackLayout>
    <Button row="2" text="{{nextSlideButton}}" fontSize="{{ mySize }}" class="-btn my-button-primary my-button-grad3:active" margin="5" tap="{{ switchTab }}"/>
</GridLayout>
`;

module.exports = {slide};
