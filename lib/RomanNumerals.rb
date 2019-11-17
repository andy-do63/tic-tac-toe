module RomanNumerals
=begin
  About:
    RomanNumerals is a utility to convert Roman Numerals to Arabic integer and visa-versa.

  Lesson learn from this exercise:
    1. Class method vs Instant method: Know when to use which.
    2. Differences between class variable, class instant variable and instant variable
    3. Array vs Hash
    4. String interpolation
    5. Software Design
      a. Input validation

  Roman Numerals Rules:
    1. Only I, X, C and M can be repeated.
    2. A numeral cannot be repeated more than 3 times.
    3. Numerals that decrease from left-to-right suggest addition of those numbers.
    4. Only these subtraction sequences are allowed: IV, IX, XL, XC, CD, CM.

    9. REGEX for Roman Numerals ^M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$
=end


  # Define module/class variables
    @@roman_numbers = {'I' => 1, 'V' => 5, 'X' => 10, 'L' => 50, 'C' => 100, 'D' => 500, 'M' => 1000}
    @@roman_numerals = @@roman_numbers.keys
    # valid_subtractions is necessary to detect DM as invalid
    @@valid_subtractions = ['IV', 'IX', 'XL', 'XC', 'CD', 'CM']
    @@repeatable_numerals = ['I', 'X', 'C', 'M']

  # ##
  # integer_to_roman method
  #   param:
  #     Int inumber         The arabic number to convert to roman
  #   return:
  #     String rstring      The roman numeral representation of the inumber
  # ##
    def self.integer_to_roman(inumber=101)
      rstring = ""

      # Is integer out of range
      if inumber < 1 || inumber > 3999
        return "-1"   # Error: Number out of range
      end

      @@roman_numerals.reverse_each do | rnumeral |
        rvalue = @@roman_numbers[rnumeral]          # Value of Roman Numeral
        rindex = @@roman_numerals.index(rnumeral)   # Index of roman numeral
        times = inumber / rvalue                    # Number of times of roman numeral found in inumber

        if times > 3
          # Step 1: Decipher the right roman combo
            last_numeral = (rstring.length > 0) ? rstring[-1,1] : ""

            if @@roman_numerals[rindex + 1] == last_numeral
              rcombo = rnumeral + @@roman_numerals[rindex + 2]
              rstring = rstring[0, rstring.length - 1]
            else
              rcombo = rnumeral + @@roman_numerals[rindex + 1]
            end

          # Step 2: Append combo to rstring
            rstring += rcombo
        elsif times > 0
          rstring += rnumeral * times
        end

        # Deduct running inumber
        inumber = inumber - (rvalue * times)
      end

      return rstring
    end

  # ##
  # roman_to_integer method
  #   param:
  #     String rnumber      String of roman representation to convert
  #   return:
  #     Int rinteger        An integer result or -1 to indicate error
  # ##
    def self.roman_to_integer(rnumber="MCMLXIII")
      # Create local var to work from
      # Ensure rstring is an array of uppercase, reversed from right-to-left
      rstring = rnumber.upcase.reverse!.split('')
      rinteger = 0 # result integer

      prev = ""                 # track previous numeral
      repeated = 1              # track number times numeral is repeated
      must_be_greater = false   # track double negative like IIX

      # Loop to convert
      rstring.each do |r|
        # Is r a valid roman numeral
        if !@@roman_numerals.include?(r)
          # Error: Contains invalid Roman Character(s)
          rinteger = -1
          break
        end

        rindex = @@roman_numerals.index(r)
        pindex = @@roman_numerals.index(prev)

        # Add Rule
        if pindex.nil? || rindex >= pindex
          # Step 1: Track repeated romans
          if r == prev
            repeated += 1
          else
            repeated = 1 # Reset count
          end

          # Step 2: Does it meet the rules:
          #     a. Cannot repeat more than 3 times
          #     b. Cannot have double negative
          if repeated > 3 || (repeated > 1 && @@repeatable_numerals.index(r).nil?) || (must_be_greater && rindex <= pindex)
            # Error: Invalid Roman sequence
            rinteger = -2
            break
          end

          # Step 3: It is okay to add
          rinteger = rinteger + @@roman_numbers[r]
          must_be_greater = false
        else
          # Subtraction Rule
          # Step 1: Is it a valid subtraction combo
          if @@valid_subtractions.index(r + prev).nil?
            # Error: Invalid Roman sequence
            rinteger = -2
            break
          end

          # Step 2: Is subtraction allow?
          if (rinteger - @@roman_numbers[r]) > @@roman_numbers[prev]
            # Error: Invalid Roman sequence
            rinteger = -2
            break
          end

          # Step 3: It is okay to subtract
          rinteger = rinteger - @@roman_numbers[r]
          must_be_greater = true
        end

        prev = r
      end # each loop

      return rinteger
    end # roman_to_integer Method

end # RomanNumerals