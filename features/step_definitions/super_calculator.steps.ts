import { Ensure, equals } from '@serenity-js/assertions';
import { actorCalled, actorInTheSpotlight, engage } from '@serenity-js/core';
import { Navigate } from '@serenity-js/protractor';
import { Before, Given, Then, When } from 'cucumber';
import {
    Actors,
    CalculationResult,
    ConfirmCalculation,
    EnterLeftSideOperand,
    EnterRightSideOperand,
    SelectOperator,
} from '../support/screenplay';

Before(() => engage(new Actors()));

Given(/(.*) decides to use the Super Calculator/, (actorName: string) =>
    actorCalled(actorName).attemptsTo(
        Navigate.to('/protractor-demo/'),
    ));

When(/(?:he|she|they) (?:adds?) (\d+) and (\d+)/, (leftSideOperand: string, rightSideOperand: string) =>
    actorInTheSpotlight().attemptsTo(
        EnterLeftSideOperand.of(leftSideOperand),
        SelectOperator.withSymbol('+'),
        EnterRightSideOperand.of(rightSideOperand),
        ConfirmCalculation(),
    ));

Then(/(?:he|she|they) should see that the result is (.*)/, (expectedResult: string) =>
    actorInTheSpotlight().attemptsTo(
        Ensure.that(CalculationResult(), equals(expectedResult)),
    ));

const ComputedStyle = (target: Question<ElementFinder>, property: string, pseudoElt: string | null = null) =>
  Question.about(`computed style ${ property } of ${ target }${ pseudoElt || '' }`, actor =>
    BrowseTheWeb.as(actor).executeScript(
      `window.getComputedStyle of ${ target }${ pseudoElt || '' }`,
      `return window.getComputedStyle(arguments[0], arguments[1])`,
      target.answeredBy(actor),
      pseudoElt
    ).then(style => style && style[property])
  );

Then(/(?:he|she|they) should verify font-size of result is (.*)/, (fontSize: string) =>
    actorInTheSpotlight().attemptsTo(
      Ensure.that(ComputedStyle(SuperCalculatorWidget.result, 'backgroundImage', ':after'), equals(`${fontSize}px`))
    ));
