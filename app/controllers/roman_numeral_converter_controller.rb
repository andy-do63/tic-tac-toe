require 'RomanNumerals'

class RomanNumeralConverterController < ApplicationController

  def index
  end

  # POST default action
  def create
    @intNumber    = params[:intNumber].chomp.to_i
    @romanNumber  = params[:romanNumber]
    @results      = {}

    # Convert Int to Roman
    result = RomanNumerals.integer_to_roman(@intNumber)
    case result
    when "-1"
      @results["IntToRoman"] = "Error: Out of Range of 1 - 3999"
    else
      @results["IntToRoman"] = "Arabic #{@intNumber} = #{result}"
    end

    # Convert Roman to Int
    result = RomanNumerals.roman_to_integer(@romanNumber)
    case result
    when -1
      @results["RomanToInt"] = "Error: Contains Invalid Roman Numeral(s)."
    when -2
      @results["RomanToInt"] = "Error: Invalid Sequence of Roman Numerals."
    else
      @results["RomanToInt"] = "Roman #{@romanNumber.upcase} = #{result}"
    end

    # Render result page
    render(:template => 'roman_numeral_converter/index')
  end
  
end
