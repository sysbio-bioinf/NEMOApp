let slide = `

<GridLayout id="slideDone" row="0" rows="*, auto" cols="auto">
    <ScrollView id="summaryScrollView" row="0"  col="0" scrollBarIndicatorVisible="false">
      <GridLayout  rows="auto,auto,auto,auto,auto,auto,auto,auto,auto,auto,auto, auto" cols="*,*" marginLeft="5" marginRight="5">
        <FlexboxLayout row="0" flexWrap="wrap" marginTop="4">
            <Label text="{{ wellnessShort }}" fontSize="{{ mySizeSummary }}" fontWeight="bold" textWrap="true" marginTop="0" class="summary-header text-left" />
            <Label id="wellnessValue" text="{{ wellness }}" fontSize="{{ mySizeSummary }}" textWrap="true" flexGrow="{{ summaryFlexGrow }}" flexWrapBefore="{{ summaryFlexWrapBefore }}" marginTop="0" class="{{ wellnessSummaryCssClass }}" tap="{{ switchBack }}"/>
        </FlexboxLayout>
        <FlexboxLayout row="1" flexWrap="wrap" marginTop="4">
            <Label text="{{ diarrhoeShort }}" fontSize="{{ mySizeSummary }}" fontWeight="bold" textWrap="true" marginTop="0" class="summary-header text-left" />
            <Label id="diarrhoeValue" text="{{ diarrhoe }}" fontSize="{{ mySizeSummary }}" textWrap="true" flexGrow="{{ summaryFlexGrow }}" flexWrapBefore="{{ summaryFlexWrapBefore }}" marginTop="0" class="{{ diarrhoeSummaryCssClass }}" tap="{{ switchBack }}"/>
        </FlexboxLayout>
        <FlexboxLayout row="2" flexWrap="wrap" marginTop="4">
            <Label text="{{ vomitShort }}" fontSize="{{ mySizeSummary }}" fontWeight="bold" textWrap="true" marginTop="0" class="summary-header text-left" />
            <Label id="vomitValue" text="{{ vomit }}" fontSize="{{ mySizeSummary }}" textWrap="true" flexGrow="{{ summaryFlexGrow }}" flexWrapBefore="{{ summaryFlexWrapBefore }}" marginTop="0" class="{{ vomitSummaryCssClass }}" tap="{{ switchBack }}"/>
        </FlexboxLayout>
        <FlexboxLayout row="3" flexWrap="wrap" alignItems="center" marginTop="4">
            <Label text="{{ painShort }}" fontSize="{{ mySizeSummary }}" fontWeight="bold" textWrap="true" marginTop="0" class="summary-header text-left" />
            <Label id="painValue" text="{{ pain }}" fontSize="{{ mySizeSummary }}" textWrap="true" flexGrow="{{ summaryFlexGrow }}" flexWrapBefore="{{ summaryFlexWrapBefore }}" marginTop="0" class="{{ painSummaryCssClass }}" tap="{{ switchBack }}"/>
        </FlexboxLayout>
        <FlexboxLayout row="4" flexWrap="wrap" marginTop="4">
            <Label text="{{ mucoShort }}" fontSize="{{ mySizeSummary }}" fontWeight="bold" textWrap="true" marginTop="0" class="summary-header text-left" />
            <Label id="mucoValue" text="{{ muco }}" fontSize="{{ mySizeSummary }}" textWrap="true" flexGrow="{{ summaryFlexGrow }}" flexWrapBefore="{{ summaryFlexWrapBefore }}" marginTop="0" class="{{ mucoSummaryCssClass }}" tap="{{ switchBack }}"/>
        </FlexboxLayout>
        <FlexboxLayout row="5" flexWrap="wrap" marginTop="4">
            <Label  text="{{ nauseaShort }}" fontSize="{{ mySizeSummary }}" fontWeight="bold" textWrap="true" marginTop="0" class="summary-header text-left" />
            <Label  id="nauseaValue" text="{{ nausea }}" fontSize="{{ mySizeSummary }}" textWrap="true" flexGrow="{{ summaryFlexGrow }}" flexWrapBefore="{{ summaryFlexWrapBefore }}" marginTop="0" class="{{ nauseaSummaryCssClass }}" tap="{{ switchBack }}"/>
        </FlexboxLayout>
        <FlexboxLayout row="6" flexWrap="wrap" marginTop="4">
            <Label  text="{{ pnpShort }}" fontSize="{{ mySizeSummary }}" fontWeight="bold" textWrap="true" marginTop="0" class="summary-header text-left" />
            <Label  id="pnpValue" text="{{ pnp }}" fontSize="{{ mySizeSummary }}" textWrap="true" flexGrow="{{ summaryFlexGrow }}" flexWrapBefore="{{ summaryFlexWrapBefore }}" marginTop="0" class="{{ pnpSummaryCssClass }}" tap="{{ switchBack }}"/>
        </FlexboxLayout>
        <FlexboxLayout row="7" flexWrap="wrap" marginTop="4">
            <Label  text="{{ fatigueShort }}" fontSize="{{ mySizeSummary }}" fontWeight="bold" textWrap="true" marginTop="0" class="summary-header text-left" />
            <Label  id="fatigueValue" text="{{ fatigue }}" fontSize="{{ mySizeSummary }}" textWrap="true" flexGrow="{{ summaryFlexGrow }}" flexWrapBefore="{{ summaryFlexWrapBefore }}" marginTop="0" class="{{ fatigueSummaryCssClass }}" tap="{{ switchBack }}"/>
        </FlexboxLayout>
        <FlexboxLayout row="8" flexWrap="wrap" marginTop="4">
            <Label  text="{{ movementShort }}" fontSize="{{ mySizeSummary }}" fontWeight="bold" textWrap="true" marginTop="0" class="summary-header text-left"  />
            <Label  id="movementValue" text="{{ movement }}" fontSize="{{ mySizeSummary }}" textWrap="true" flexGrow="{{ summaryFlexGrow }}" flexWrapBefore="{{ summaryFlexWrapBefore }}" marginTop="0" class="{{ movementSummaryCssClass }}" tap="{{ switchBack }}"/>
        </FlexboxLayout>
        <FlexboxLayout row="9" flexWrap="wrap" marginTop="4">
            <Label  text="{{ weightShort }}" fontSize="{{ mySizeSummary }}" fontWeight="bold" textWrap="true" marginTop="0" class="summary-header text-left"  />
            <Label  id="weightValue" text="{{ weight }}" fontSize="{{ mySizeSummary }}" textWrap="true" flexGrow="{{ summaryFlexGrow }}" flexWrapBefore="{{ summaryFlexWrapBefore }}" marginTop="0" class="{{ weightSummaryCssClass }}" tap="{{ switchBack }}" />
        </FlexboxLayout>
        <FlexboxLayout row="10" flexWrap="wrap" marginTop="4">
            <Label  text="{{ eventShort }}" fontSize="{{ mySizeSummary }}" verticalAlignment="top" fontWeight="bold" marginTop="0" textWrap="true" class="summary-header text-left" />
            <Label  id="eventValue" text="{{ event }}" fontSize="{{ mySizeSummary }}" textWrap="true" flexGrow="{{ summaryFlexGrow }}" flexWrapBefore="{{ summaryEventFlexWrapBefore }}" marginTop="0" class="{{ eventSummaryCssClass }}" tap="{{ switchBack }}"/>
        </FlexboxLayout>
        <FlexboxLayout row="11" flexWrap="wrap" marginTop="4">    
            <Label  text="{{ medicationShort }}" fontSize="{{ mySizeSummary }}" verticalAlignment="top" fontWeight="bold" textWrap="true" marginTop="0" class="summary-header text-left" />
            <Label  id="medicationValue" text="{{ medication }}" fontSize="{{ mySizeSummary }}" textWrap="true" flexGrow="{{ summaryFlexGrow }}" flexWrapBefore="{{ summaryFlexWrapBefore }}" marginTop="0" class="{{ medicationSummaryCssClass }}" tap="{{ switchBack }}"/>
        </FlexboxLayout>
    </GridLayout>  
    </ScrollView>
     <FlexboxLayout id="summary" row="1" justifyContent="center" flexWrap="wrap" ios:paddingTop="6" margin="0">
       <Button order="1" flexGrow="{{ summaryFlexGrow }}" text="{{ changeButtonCurrent }}" fontSize="{{ mySizePrimaryButton }}" class="-btn btn-primary my-button-primary my-button-gradX:active" tap="{{ activateSwitchBack }}" margin="4" ios:marginBottom="0" />
       <Button order="2" flexGrow="{{ summaryFlexGrow }}" text="{{ saveButton }}" fontSize="{{ mySizePrimaryButton }}" class="-btn btn-primary my-button-primary my-button-gradX:active" tap="{{ switchTab }}" margin="4" ios:marginBottom="0" />
    </FlexboxLayout>
    </GridLayout>

`;

module.exports = { slide };
